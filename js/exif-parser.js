(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ExifParser = factory();
  }
}(this, function () {
  'use strict';

  function ExifParser() {}

  var TAGS = {
    0x0100: 'ImageWidth',
    0x0101: 'ImageHeight',
    0x0112: 'Orientation',
    0x8769: 'ExifIFDPointer',
    0x8825: 'GPSInfoIFDPointer',
    0xA002: 'PixelXDimension',
    0xA003: 'PixelYDimension'
  };

  var GPSTags = {
    0x0000: 'GPSVersionID',
    0x0001: 'GPSLatitudeRef',
    0x0002: 'GPSLatitude',
    0x0003: 'GPSLongitudeRef',
    0x0004: 'GPSLongitude',
    0x0005: 'GPSAltitudeRef',
    0x0006: 'GPSAltitude',
    0x0007: 'GPSTimeStamp',
    0x0008: 'GPSSatellites',
    0x0009: 'GPSStatus',
    0x000A: 'GPSMeasureMode',
    0x000B: 'GPSDOP',
    0x000C: 'GPSSpeedRef',
    0x000D: 'GPSSpeed',
    0x000E: 'GPSTrackRef',
    0x000F: 'GPSTrack',
    0x0010: 'GPSImgDirectionRef',
    0x0011: 'GPSImgDirection',
    0x0012: 'GPSMapDatum',
    0x0013: 'GPSDestLatitudeRef',
    0x0014: 'GPSDestLatitude',
    0x0015: 'GPSDestLongitudeRef',
    0x0016: 'GPSDestLongitude',
    0x0017: 'GPSDestBearingRef',
    0x0018: 'GPSDestBearing',
    0x0019: 'GPSDestDistanceRef',
    0x001A: 'GPSDestDistance',
    0x001B: 'GPSProcessingMethod',
    0x001C: 'GPSAreaInformation',
    0x001D: 'GPSDateStamp',
    0x001E: 'GPSDifferential'
  };

  function getStringFromDB(buffer, start, length) {
    var view = new Uint8Array(buffer);
    var out = '';
    for (var i = start; i < start + length; i++) {
      var c = view[i];
      if (c === 0) break;
      out += String.fromCharCode(c);
    }
    return out;
  }

  function getStringValue(value) {
    if (Array.isArray(value)) {
      return String.fromCharCode.apply(null, value.filter(function (c) { return c !== 0; }));
    }
    return String(value);
  }

  function readTagValue(dataView, offset, type, count, littleEndian, tiffOffset) {
    var value = [];
    var size = 1;
    switch (type) {
      case 1: size = 1; break;
      case 2: size = 1; break;
      case 3: size = 2; break;
      case 4: size = 4; break;
      case 5: size = 8; break;
      case 7: size = 1; break;
      case 9: size = 4; break;
      case 10: size = 8; break;
      default: return null;
    }

    var totalSize = size * count;
    var valueOffset = offset;

    if (totalSize > 4) {
      // EXIF 中的偏移量是相对于 TIFF 头的，需要加上 tiffOffset 才是文件中的绝对位置
      valueOffset = tiffOffset + dataView.getUint32(offset, littleEndian);
    }

    for (var i = 0; i < count; i++) {
      switch (type) {
        case 1:
          value.push(dataView.getUint8(valueOffset + i));
          break;
        case 2:
          value.push(dataView.getUint8(valueOffset + i));
          break;
        case 3:
          value.push(dataView.getUint16(valueOffset + i * 2, littleEndian));
          break;
        case 4:
          value.push(dataView.getUint32(valueOffset + i * 4, littleEndian));
          break;
        case 5:
          var numerator = dataView.getUint32(valueOffset + i * 8, littleEndian);
          var denominator = dataView.getUint32(valueOffset + i * 8 + 4, littleEndian);
          value.push(denominator !== 0 ? numerator / denominator : 0);
          break;
        case 7:
          value.push(dataView.getUint8(valueOffset + i));
          break;
        case 9:
          value.push(dataView.getUint32(valueOffset + i * 4, littleEndian));
          break;
        case 10:
          var n = dataView.getUint32(valueOffset + i * 8, littleEndian);
          var d = dataView.getUint32(valueOffset + i * 8 + 4, littleEndian);
          value.push(d !== 0 ? n / d : 0);
          break;
      }
    }

    if (type === 2) {
      return getStringValue(value);
    }

    if (count === 1) {
      return value[0];
    }

    return value;
  }

  function parseExifTags(dataView, ifdOffset, littleEndian, tiffOffset) {
    var tags = {};
    var numEntries = dataView.getUint16(ifdOffset, littleEndian);
    var offset = ifdOffset + 2;

    for (var i = 0; i < numEntries; i++) {
      var tag = dataView.getUint16(offset, littleEndian);
      var type = dataView.getUint16(offset + 2, littleEndian);
      var count = dataView.getUint32(offset + 4, littleEndian);
      var tagValue = readTagValue(dataView, offset + 8, type, count, littleEndian, tiffOffset);

      tags[tag] = tagValue;
      offset += 12;
    }

    return tags;
  }

  function decodeGPSCoordinate(values, ref) {
    if (!Array.isArray(values) || values.length < 3) return null;

    var degrees = parseFloat(values[0]);
    var minutes = parseFloat(values[1]);
    var seconds = parseFloat(values[2]);

    var decimal = degrees + minutes / 60.0 + seconds / 3600.0;

    if (ref === 'S' || ref === 'W') {
      decimal = -decimal;
    }

    return decimal;
  }

  function parseDateTime(dateStr, timeStr) {
    if (!dateStr && !timeStr) return null;

    var datePart = dateStr || '0000:00:00';

    // EXIF DateTime 格式为 "YYYY:MM:DD HH:MM:SS"（日期和时间在同一字符串中）
    // 若未单独提供 timeStr，则从 dateStr 的空格后面提取时间部分
    var timePart = timeStr;
    if (!timePart && dateStr && dateStr.indexOf(' ') !== -1) {
      timePart = dateStr.split(' ')[1] || null;
    }

    var dateMatch = datePart.match(/(\d{4}):(\d{2}):(\d{2})/);
    // 时间必须匹配完整 HH:MM:SS（避免误匹配日期部分 "26:07:21"）
    var timeMatch = timePart ? ('' + timePart).match(/^(\d{1,2}):(\d{2}):(\d{2})/) : null;

    if (!dateMatch) return null;

    var year = parseInt(dateMatch[1]);
    var month = parseInt(dateMatch[2]) - 1;
    var day = parseInt(dateMatch[3]);
    var hour = timeMatch ? parseInt(timeMatch[1]) : 0;
    var minute = timeMatch ? parseInt(timeMatch[2]) : 0;
    var second = timeMatch ? parseInt(timeMatch[3]) : 0;

    return new Date(year, month, day, hour, minute, second);
  }

  function parseTiffFromOffset(dataView, tiffOffset) {
    var byteOrder = dataView.getUint16(tiffOffset, false);
    var littleEndian = (byteOrder === 0x4949);

    var magic = dataView.getUint16(tiffOffset + 2, littleEndian);
    if (magic !== 0x002A) return null;

    var ifd0Offset = dataView.getUint32(tiffOffset + 4, littleEndian);
    var ifd0Tags = parseExifTags(dataView, tiffOffset + ifd0Offset, littleEndian, tiffOffset);

    var gpsInfoIFDPointer = ifd0Tags[0x8825];

    var gpsData = null;
    if (gpsInfoIFDPointer) {
      var gpsTags = parseExifTags(dataView, tiffOffset + gpsInfoIFDPointer, littleEndian, tiffOffset);

      var latRef = gpsTags[0x0001];
      var latValues = gpsTags[0x0002];
      var lonRef = gpsTags[0x0003];
      var lonValues = gpsTags[0x0004];
      var altitude = gpsTags[0x0006];
      var altitudeRef = gpsTags[0x0005];

      gpsData = {};

      if (latValues && latRef) {
        gpsData.latitude = decodeGPSCoordinate(
          Array.isArray(latValues) ? latValues : [latValues],
          typeof latRef === 'string' ? latRef : String.fromCharCode(latRef || 78)
        );
      }

      if (lonValues && lonRef) {
        gpsData.longitude = decodeGPSCoordinate(
          Array.isArray(lonValues) ? lonValues : [lonValues],
          typeof lonRef === 'string' ? lonRef : String.fromCharCode(lonRef || 69)
        );
      }

      if (altitude !== null && altitude !== undefined) {
        gpsData.altitude = typeof altitude === 'number' ? altitude : (Array.isArray(altitude) ? altitude[0] : null);
        if (altitudeRef !== null && altitudeRef !== undefined) {
          var refVal = typeof altitudeRef === 'number' ? altitudeRef : (Array.isArray(altitudeRef) ? altitudeRef[0] : 0);
          if (refVal === 1) {
            gpsData.altitude = -gpsData.altitude;
          }
        }
      }
    }

    var exifOffset = ifd0Tags[0x8769];
    var exifTags = null;
    if (exifOffset) {
      try {
        exifTags = parseExifTags(dataView, tiffOffset + exifOffset, littleEndian, tiffOffset);
      } catch (e) {
      }
    }

    var dateTimeStr = null;
    var dateTimeTag = ifd0Tags[0x0132];
    if (dateTimeTag) {
      dateTimeStr = dateTimeTag;
    } else if (exifTags && exifTags[0x9003]) {
      dateTimeStr = exifTags[0x9003];
    } else if (exifTags && exifTags[0x9004]) {
      dateTimeStr = exifTags[0x9004];
    }

    var orientation = ifd0Tags[0x0112] || (exifTags ? exifTags[0x0112] : null) || 1;
    var make = ifd0Tags[0x010F] ? getStringValue(ifd0Tags[0x010F]) : null;
    var model = ifd0Tags[0x0110] ? getStringValue(ifd0Tags[0x0110]) : null;

    var parsedDate = null;
    if (dateTimeStr) {
      parsedDate = parseDateTime(dateTimeStr, null);
    }

    return {
      gps: gpsData ? {
        latitude: gpsData.latitude || null,
        longitude: gpsData.longitude || null,
        altitude: gpsData.altitude || null
      } : null,
      orientation: orientation,
      make: make,
      model: model,
      dateTime: parsedDate ? parsedDate.toISOString() : null,
      dateTimeOriginal: dateTimeStr || null,
      hasGps: !!(gpsData && gpsData.latitude !== null && gpsData.latitude !== undefined &&
                 gpsData.longitude !== null && gpsData.longitude !== undefined)
    };
  }

  ExifParser.prototype = {
    /**
     * 从 JPEG 文件的 ArrayBuffer 中解析 EXIF 数据
     * @param {ArrayBuffer} buffer - JPEG 文件的二进制数据
     * @returns {Object|null} 解析结果，包含 gps 信息和照片基本信息
     */
    parse: function (buffer) {
      try {
        var dataView = new DataView(buffer);
        var byteLength = buffer.byteLength;

        if (dataView.getUint16(0, false) !== 0xFFD8) {
          return null;
        }

        var offset = 2;
        var exifData = null;

        while (offset < byteLength - 1) {
          if (dataView.getUint16(offset, false) === 0xFFE1) {
            var app1Length = dataView.getUint16(offset + 2, false);
            var exifHeader = getStringFromDB(buffer, offset + 4, 4);

            if (exifHeader === 'Exif') {
              exifData = {
                rawOffset: offset + 10,
                rawLength: app1Length - 2
              };
            }
            offset += 2 + app1Length;
          } else {
            var marker = dataView.getUint16(offset, false);
            var markerLen = 2;

            if (marker !== 0xFFD8 && marker !== 0xFFD9) {
              if (offset + 3 < byteLength) {
                markerLen = dataView.getUint16(offset + 2, false);
              }
            }

            offset += 2 + markerLen;
          }

          if (exifData) break;
        }

        if (!exifData) return null;

        return parseTiffFromOffset(dataView, exifData.rawOffset);
      } catch (e) {
        console.warn('EXIF parsing failed:', e.message);
        return null;
      }
    },

    /**
     * 从 HEIC 文件的 ArrayBuffer 中直接解析 EXIF 数据（无需转换为 JPEG）
     * HEIC 文件使用 ISOBMFF 容器，EXIF 数据以 TIFF 格式存储在其中。
     * 此方法通过搜索 TIFF 头来定位 EXIF 数据，不依赖 heic2any 等转换库。
     * @param {ArrayBuffer} buffer - HEIC 文件的二进制数据
     * @returns {Object|null} 解析结果，格式与 parse() 相同
     */
    parseHEIC: function (buffer) {
      try {
        var dataView = new DataView(buffer);
        var byteLength = buffer.byteLength;

        // HEIC 文件中的 EXIF 数据以 TIFF 头开始
        // 小端: 0x49 0x49 0x2A 0x00 ("II" + 42)
        // 大端: 0x4D 0x4D 0x00 0x2A ("MM" + 42)
        // 搜索整个文件找到 TIFF 头
        var bestResult = null;

        for (var i = 0; i < byteLength - 4; i++) {
          var b0 = dataView.getUint8(i);
          var b1 = dataView.getUint8(i + 1);
          var b2 = dataView.getUint8(i + 2);
          var b3 = dataView.getUint8(i + 3);

          var isLittleEndian = (b0 === 0x49 && b1 === 0x49 && b2 === 0x2A && b3 === 0x00);
          var isBigEndian = (b0 === 0x4D && b1 === 0x4D && b2 === 0x00 && b3 === 0x2A);

          if (!isLittleEndian && !isBigEndian) continue;

          // 找到 TIFF 头，尝试解析
          try {
            var result = parseTiffFromOffset(dataView, i);
            if (result) {
              // 优先返回包含 GPS 的结果
              if (result.hasGps) {
                return result;
              }
              // 否则记录第一个有效结果
              if (!bestResult) {
                bestResult = result;
              }
            }
          } catch (e) {
            // 此偏移量解析失败，继续搜索
            continue;
          }
        }

        return bestResult;
      } catch (e) {
        console.warn('HEIC EXIF parsing failed:', e.message);
        return null;
      }
    },

    /**
     * 检查文件是否为 JPEG 格式
     * @param {ArrayBuffer} buffer
     * @returns {boolean}
     */
    isJPEG: function (buffer) {
      if (!buffer || buffer.byteLength < 2) return false;
      try {
        var view = new DataView(buffer);
        return view.getUint16(0, false) === 0xFFD8;
      } catch (e) {
        return false;
      }
    },

    /**
     * 批量解析多个 JPEG 文件的 EXIF 数据
     * @param {Array<{name: string, buffer: ArrayBuffer}>} files
     * @returns {Array<{name: string, exif: Object|null}>}
     */
    parseBatch: function (files) {
      var results = [];
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var exif = null;
        if (this.isJPEG(file.buffer)) {
          exif = this.parse(file.buffer);
        }
        results.push({
          name: file.name,
          exif: exif
        });
      }
      return results;
    },

    /**
     * 将度分秒格式转换为十进制
     * @param {number} degrees
     * @param {number} minutes
     * @param {number} seconds
     * @param {string} ref - 'N','S','E','W'
     * @returns {number}
     */
    DMSToDecimal: function (degrees, minutes, seconds, ref) {
      var decimal = degrees + minutes / 60.0 + seconds / 3600.0;
      if (ref === 'S' || ref === 'W') decimal = -decimal;
      return decimal;
    }
  };

  return new ExifParser();
}));
