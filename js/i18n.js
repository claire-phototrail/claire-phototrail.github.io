/**
 * i18n.js - 多语言支持
 * 支持三种语言：简体中文(zh-CN)、繁体中文/香港(zh-HK)、英文(en)
 */
var I18N = (function () {
  'use strict';

  var currentLang = localStorage.getItem('app_lang') || 'zh-CN';

  var translations = {
    'zh-CN': {
      // Top bar
      app_title: 'PhotoTrail',
      app_subtitle: '在地图上重走每段旅程',
      app_title_planner: '旅游规划',
      app_title_diary: '旅游日记',
      app_subtitle_planner: '规划最优路线 · 走遍想去的地方',
      app_subtitle_diary: '上传照片，在地图上回溯旅行足迹',
      upload_btn: '上传照片/压缩包',
      status_ready: '就绪',
      lang_label: '语言',

      // Tabs
      tab_photos: '照片',
      tab_path: '路径',
      tab_export: '导出',
      tab_settings: '设置',

      // Photos tab
      photo_list: '照片列表',
      photos_unit: '张',
      stat_total: '照片总数',
      stat_gps: '已定位',
      stat_nogps: '无坐标',
      stat_daterange: '日期跨度',
      date_filter: '日期筛选',
      start_date: '开始日期',
      end_date: '结束日期',
      gps_status: '定位状态',
      filter_all: '全部',
      filter_yes: '有坐标',
      filter_no: '无坐标',
      apply_filter: '应用筛选',

      // Path tab
      multi_route: '多路线规划',
      route_desc: '支持添加多条路线，每条路线可独立设置起点、途经点和终点，用不同颜色区分。点击路线可编辑其点位，每个点位都可随时删除。',
      add_route: '添加新路线',
      path_info: '路径信息',
      path_detail_placeholder: '添加路线并设置起点、终点后自动计算路径',
      graph_build: '图构建',
      graph_desc: '使用 K-近邻算法自动构建所有点位（照片 + 路线点）的图结构',
      k_value: 'K 值 (邻居数)',
      build_knn: '构建 KNN 图',
      build_complete: '构建完全图',

      // Route controls
      route_name_prefix: '路线',
      map_point_prefix: '地图点',
      start_point: '起点',
      end_point: '终点',
      waypoint_point: '途经点',
      start_point_icon: '🟢 起点',
      end_point_icon: '🔴 终点',
      waypoints_icon: '途经点',
      map_select: '📍 地图选点',
      photo_select: '📷 照片选点',
      map_add: '📍 地图添加',
      photo_add: '📷 照片添加',
      start_not_set: '未设置起点',
      end_not_set: '未设置终点',
      no_waypoints: '无途经点',
      recalc: '🧮 重新计算',
      clear_route: '🗑️ 清空此路线',
      delete_btn: '删除',
      show: '显示',
      hide: '隐藏',
      delete_photo: '删除这张照片',
      delete_photo_confirm: '确定删除这张照片？删除后无法恢复：',
      photo_deleted: '✅ 照片已删除',
      no_routes: '暂无路线，点击下方按钮添加',
      add_route_first: '请先添加一条路线',

      // Export tab
      data_export: '数据导出',
      export_desc: '将照片位置数据导出为常见 GIS 格式，可在其他地图软件中打开。',
      export_stats: '导出统计',
      exportable_count: '可导出的已定位照片数',

      // Settings tab
      map_settings: '地图设置',
      tianditu_key: '天地图 API Key',
      tianditu_key_placeholder: '请输入天地图 API Key',
      tianditu_hint: '前往',
      tianditu_link: '天地图官网',
      tianditu_hint2: '注册获取',
      amap_key: '高德 API Key（可选）',
      amap_key_placeholder: '填入后搜索与路线规划改用高德',
      amap_hint: '填入后地点搜索和路线规划改走国内高德服务；留空则用国际 OpenStreetMap。',
      amap_link: '免费申请',
      amap_key_active: '高德已启用：地点搜索与路线规划走国内服务',
      amap_key_inactive: '未启用，当前使用国际 OpenStreetMap 服务',
      amap_key_saved: '✅ 高德 Key 已保存并启用',
      amap_key_cleared: '已清空高德 Key，恢复使用国际服务',
      map_layer: '地图底图',
      map_vec: '矢量底图',
      map_img: '卫星影像',
      apply_map_settings: '应用地图设置',
      basemap_provider: '底图来源',
      basemap_amap: '高德地图（免 Key）',
      basemap_tianditu: '天地图（需填 Key）',
      basemap_hint: '高德底图免密钥、国内加载快；改完记得点下方「应用地图设置」。',
      map_layer_style: '底图样式',
      about: '关于',
      about_text: 'PhotoTrail v1.0',
      about_desc: '基于 Leaflet + 高德地图 构建，使用 JSZip 解压，纯前端 EXIF 解析。',
      about_algo: '图论算法：Dijkstra、A*、Floyd-Warshall、Prim、TSP 近似。',

      // Gallery
      gallery_empty: '上传包含旅行照片的 .zip 压缩包或单张 .jpg/.heic 照片即可开始',

      // Drag overlay
      drag_title: '释放以上传',
      drag_desc: '支持 .zip 压缩包 或 .jpg/.heic 单张照片',

      // Progress
      processing: '处理中...',
      parsing_heic_1: '正在解析 ',
      parsing_heic_2: ' 张照片（HEIC 转换中，请稍候）...',
      parsing_exif_1: '正在解析 ',
      parsing_exif_2: ' 张照片的 EXIF...',
      altitude_label: '海拔',

      // Photo popup
      no_preview_heic: '无预览图（HEIC）',
      no_preview: '无预览图',
      enlarge: '🔍 放大查看',

      // Status messages
      status_parsing: '正在解析...',
      status_no_photos: '未找到照片',
      status_photos_loaded: '张照片已加载',
      status_parse_failed: '解析失败',
      status_reading_photo: '正在解析照片 GPS...',
      status_read_failed: '读取失败',
      status_gps_failed: 'GPS 解析失败',

      // Toast messages
      toast_point_marked: '✅ 已在地图上标记点位',
      toast_no_photos_in_zip: '压缩包中未找到 JPEG 或 HEIC 格式的图片文件',
      toast_found_photos: '找到',
      toast_parsing_exif: '张照片，正在解析 EXIF...',
      toast_updating_map: '正在更新地图...',
      toast_done: '完成! 已加载',
      toast_done2: '完成! 共加载',
      toast_load_success_1: '✅ 成功加载',
      toast_load_success_2: '张照片，其中',
      toast_load_success_3: '张含有 GPS 坐标',
      toast_load_success_4: '张含有 GPS 坐标，已标注到地图',
      toast_no_gps_1: '⚠️ 加载了',
      toast_no_gps_2: '张照片，但未检测到 GPS 坐标（照片可能未开启定位）',
      toast_parse_failed_photo: '❌ 照片解析失败: ',
      toast_parse_failed_zip: '❌ 压缩包解析失败: ',
      toast_invalid_format: '❌ 请上传 .jpg、.jpeg 或 .heic 格式的照片',
      toast_mixed_upload: '⚠️ 请不要混合上传压缩包和照片，请分开上传',
      toast_invalid_files: '❌ 请上传 .zip 压缩包或 .jpg/.jpeg/.heic 照片',
      toast_route_added_1: '已添加',
      toast_route_added_2: '，请设置起点和终点',
      toast_route_deleted_1: '已删除',
      toast_point_deleted: '已删除该点位',
      toast_route_cleared_1: '已清空',
      toast_route_cleared_2: '的所有点位',
      toast_all_routes_cleared: '已清除所有路线',
      toast_select_route_first: '请先添加或选择一条路线',
      toast_parsing_gps: '📷 正在解析照片中的 GPS 坐标...',
      toast_no_gps_in_photo: '❌ 照片未检测到 GPS 坐标，请确认拍照时已开启定位',
      toast_gps_success_1: '✅ 已从照片提取 GPS 并设为',
      toast_gps_success_2: '的',
      toast_read_photo_failed: '❌ 读取照片失败',
      toast_recalc_done: '已重新计算路径',
      toast_select_point_1: '请在地图上点击选择',
      toast_select_point_2: '的',
      toast_need_2_points: '至少需要 2 个点位（照片坐标或路线点）才能构建图',
      toast_complete_graph_1: '完全图已构建: ',
      toast_complete_graph_2: ' 个节点',
      toast_knn_graph_1: 'KNN 图已构建 (K=',
      toast_knn_graph_2: '): ',
      toast_knn_graph_3: ' 个节点',
      toast_no_exportable: '没有可导出的带坐标照片',
      toast_export_success_1: '✅ 已导出',
      toast_export_success_2: ' 条记录为 ',
      toast_export_success_3: ' 格式',
      toast_export_failed: '❌ 导出失败，请重试',
      export_preparing: '⏳ 正在生成导出文件（含照片压缩）...',
      export_kml_docname: '旅游日记 · 旅行轨迹',
      export_track: '轨迹',
      export_place: '地点',
      export_photo_limit: '张（其余未内嵌，避免文件过大）',
      export_all_btn: '🗺️ 导出全部 (KML)',
      export_all_desc: '一次性把「旅游日记」（照片轨迹 + 序号地点 + 照片）和「旅游规划」（路线 + 序号地点）全部合并导出为一个 KML，可在 Google Earth、ArcGIS 中打开。',
      export_all_docname: '全部旅行数据 · 日记与规划',
      export_all_planner: '旅游规划',
      export_all_empty: '没有可导出的内容（请先上传带定位的照片，或添加规划路线）',
      toast_map_settings_updated: '✅ 地图设置已更新',
      toast_tdt_key_needed: '天地图需要填写有效 Key，已临时改用高德底图',

      // Route info
      route_info_start: '起点',
      route_info_end: '终点',
      route_info_waypoints: '途经点',
      route_info_waypoints_unit: '个',
      route_info_nodes: '路径节点',
      route_info_distance: '总距离',
      route_info_algo: '算法',
      route_info_status_set: '起点→',
      route_info_status_waypoints: '途经→终点',
      route_info_status_start_only: '仅起点',
      route_info_status_end_only: '仅终点',
      route_info_status_empty: '未设置',

      // Misc
      no_matching_photos: '没有符合条件的照片',
      no_gps_badge: '无坐标',
      waypoint_label: '途经',
      km: '公里',
      m: '米',

      // 模式切换
      mode_planner: '旅游规划',
      mode_diary: '旅游日记',
      mode_switched_planner: '🗺️ 已切换到旅游规划模式',
      mode_switched_diary: '📸 已切换到旅游日记模式',

      // 旅行规划
      planner_tab: '🗺️ 旅行规划',
      planner_search_title: '搜索地点',
      planner_search_placeholder: '输入地点名称，如：天安门',
      planner_search_btn: '搜索',
      planner_searching: '搜索中...',
      planner_search_failed: '搜索失败，请检查网络后重试',
      planner_search_no_result: '未找到该地点，请换个关键词试试',
      planner_places_title: '地点列表',
      planner_click_hint: '💡 也可以直接点击地图添加地点。每个地点可设置角色：起点 / 景点 / 终点。',
      planner_empty_list: '暂无地点，请搜索或点击地图添加',
      planner_map_place: '地图点',
      planner_role_start: '起点',
      planner_role_end: '终点',
      planner_role_attraction: '景点',
      planner_transport: '出行方式',
      planner_walk: '步行',
      planner_drive: '驾车',
      planner_plan_btn: '⚡ 计算最优路线',
      planner_clear_btn: '🗑️ 清除路线',
      planner_result_title: '最优路线结果',
      planner_need_more_places: '至少需要 2 个地点才能规划路线',
      planner_calculating: '正在计算最优路线，请稍候...',
      planner_calc_failed: '路线计算失败，请稍后重试',
      planner_total_distance: '总距离',
      planner_total_time: '预计时间',
      planner_visit_order: '访问顺序',
      planner_leg_distance: '距上一站',
      planner_place_added: '✅ 已添加地点',
      planner_cleared: '已清除当前路线的所有地点',
      planner_export_title: '导出规划路线',
      planner_export_desc: '把规划好的地点和路线导出，可在 Google Earth、ArcGIS 等软件中打开。已计算过最优路线的，会导出真实道路轨迹。',
      planner_export_kml_docname: '旅游规划路线',
      planner_export_empty: '暂无规划路线可导出',
      planner_export_unit: '个地点',
      planner_export_none: '还没有规划路线，先添加地点并计算路线吧',
      planner_export_routes: '条路线',
      planner_export_tracks: '条轨迹',
      planner_usage_title: '使用指南',
      planner_usage_body: '1. 新增路线并命名（可规划多条路线）<br/>2. 搜索地点或点击地图添加地点，把必去景点都加进来<br/>3. 设置起点（如酒店）、终点（可设为起点作往返）<br/>4. 选择步行或驾车，点击「计算最优路线」<br/>5. 查看总距离、预计时间与访问顺序',
      planner_routes_title: '我的规划路线',
      planner_routes_desc: '可以规划多条路线，每条独立命名、独立颜色。切换到某条路线后添加的地点都属于该路线。',
      planner_add_route: '➕ 新增路线',
      planner_route_default: '路线',
      planner_route_name_prompt: '请输入路线名称',
      planner_route_rename_prompt: '重命名路线：',
      planner_route_delete_confirm: '确定删除该规划路线（路线内的地点会一并删除）',
      planner_route_empty: '还没有规划路线，点击上方按钮创建',
      state_restored: '✅ 已恢复上次保存的数据',
      hour_unit: '小时',
      minute_unit: '分钟',

      // 旅行轨迹（日记模式）
      trace_title: '旅行轨迹',
      trace_desc: '按拍摄时间排序连接所有照片位置，形成真实旅行轨迹。',
      trace_road: '真实道路',
      trace_line: '直线连接',
      trace_draw: '🗺️ 绘制轨迹',
      trace_need_photos: '至少需要 2 张带 GPS 坐标的照片',
      trace_drawn: '✅ 轨迹绘制完成',

      // 我的行程（多行程）
      trips_title: '我的行程',
      trips_desc: '创建行程后，上传的照片会归入当前选中的行程。每个行程有独立的颜色和轨迹。',
      add_trip: '➕ 新增行程',
      trip_default_name: '行程',
      trip_name_prompt: '请输入行程名称',
      trip_delete_confirm: '确定删除行程（行程内的照片会保留）',
      trip_empty: '还没有行程，点击下方按钮创建',
      trip_active_badge: '当前',
      trip_switched: '已切换到行程',
      trip_ungrouped: '未分组照片',
      trip_locations_unit: '个地点',
      rename: '重命名'
    },

    'zh-HK': {
      // Top bar
      app_title: 'PhotoTrail',
      app_subtitle: '在地圖上重走每段旅程',
      app_title_planner: '旅遊規劃',
      app_title_diary: '旅遊日記',
      app_subtitle_planner: '規劃最優路線 · 走遍想去的地方',
      app_subtitle_diary: '上傳照片，在地圖上回溯旅行足跡',
      upload_btn: '上傳照片/壓縮包',
      status_ready: '就緒',
      lang_label: '語言',

      // Tabs
      tab_photos: '照片',
      tab_path: '路徑',
      tab_export: '匯出',
      tab_settings: '設定',

      // Photos tab
      photo_list: '照片列表',
      photos_unit: '張',
      stat_total: '照片總數',
      stat_gps: '已定位',
      stat_nogps: '無坐標',
      stat_daterange: '日期跨度',
      date_filter: '日期篩選',
      start_date: '開始日期',
      end_date: '結束日期',
      gps_status: '定位狀態',
      filter_all: '全部',
      filter_yes: '有坐標',
      filter_no: '無坐標',
      apply_filter: '應用篩選',

      // Path tab
      multi_route: '多路線規劃',
      route_desc: '支援添加多條路線，每條路線可獨立設定起點、途經點和終點，用不同顏色區分。點擊路線可編輯其點位，每個點位都可隨時刪除。',
      add_route: '添加新路線',
      path_info: '路徑資訊',
      path_detail_placeholder: '添加路線並設定起點、終點後自動計算路徑',
      graph_build: '圖構建',
      graph_desc: '使用 K-近鄰算法自動構建所有點位（照片 + 路線點）的圖結構',
      k_value: 'K 值 (鄰居數)',
      build_knn: '構建 KNN 圖',
      build_complete: '構建完全圖',

      // Route controls
      route_name_prefix: '路線',
      map_point_prefix: '地圖點',
      start_point: '起點',
      end_point: '終點',
      waypoint_point: '途經點',
      start_point_icon: '🟢 起點',
      end_point_icon: '🔴 終點',
      waypoints_icon: '途經點',
      map_select: '📍 地圖選點',
      photo_select: '📷 照片選點',
      map_add: '📍 地圖添加',
      photo_add: '📷 照片添加',
      start_not_set: '未設定起點',
      end_not_set: '未設定終點',
      no_waypoints: '無途經點',
      recalc: '🧮 重新計算',
      clear_route: '🗑️ 清空此路線',
      delete_btn: '刪除',
      show: '顯示',
      hide: '隱藏',
      delete_photo: '刪除這張照片',
      delete_photo_confirm: '確定刪除這張照片？刪除後無法恢復：',
      photo_deleted: '✅ 照片已刪除',
      no_routes: '暫無路線，點擊下方按鈕添加',
      add_route_first: '請先添加一條路線',

      // Export tab
      data_export: '資料匯出',
      export_desc: '將照片位置資料匯出為常見 GIS 格式，可在其他地圖軟件中開啟。',
      export_stats: '匯出統計',
      exportable_count: '可匯出的已定位照片數',

      // Settings tab
      map_settings: '地圖設定',
      tianditu_key: '天地圖 API Key',
      tianditu_key_placeholder: '請輸入天地圖 API Key',
      tianditu_hint: '前往',
      tianditu_link: '天地圖官網',
      tianditu_hint2: '註冊獲取',
      amap_key: '高德 API Key（可選）',
      amap_key_placeholder: '填入後搜尋與路線規劃改用高德',
      amap_hint: '填入後地點搜尋和路線規劃改走國內高德服務；留空則用國際 OpenStreetMap。',
      amap_link: '免費申請',
      amap_key_active: '高德已啟用：地點搜尋與路線規劃走國內服務',
      amap_key_inactive: '未啟用，目前使用國際 OpenStreetMap 服務',
      amap_key_saved: '✅ 高德 Key 已儲存並啟用',
      amap_key_cleared: '已清空高德 Key，恢復使用國際服務',
      map_layer: '地圖底圖',
      map_vec: '矢量底圖',
      map_img: '衛星影像',
      apply_map_settings: '應用地圖設定',
      basemap_provider: '底圖來源',
      basemap_amap: '高德地圖（免 Key）',
      basemap_tianditu: '天地圖（需填 Key）',
      basemap_hint: '高德底圖免密鑰、載入快；改完記得點下方「應用地圖設定」。',
      map_layer_style: '底圖樣式',
      about: '關於',
      about_text: 'PhotoTrail v1.0',
      about_desc: '基於 Leaflet + 高德地圖 構建，使用 JSZip 解壓，純前端 EXIF 解析。',
      about_algo: '圖論算法：Dijkstra、A*、Floyd-Warshall、Prim、TSP 近似。',

      // Gallery
      gallery_empty: '上傳包含旅行照片的 .zip 壓縮包或單張 .jpg/.heic 照片即可開始',

      // Drag overlay
      drag_title: '釋放以上傳',
      drag_desc: '支援 .zip 壓縮包 或 .jpg/.heic 單張照片',

      // Progress
      processing: '處理中...',
      parsing_heic_1: '正在解析 ',
      parsing_heic_2: ' 張照片（HEIC 轉換中，請稍候）...',
      parsing_exif_1: '正在解析 ',
      parsing_exif_2: ' 張照片的 EXIF...',
      altitude_label: '海拔',

      // Photo popup
      no_preview_heic: '無預覽圖（HEIC）',
      no_preview: '無預覽圖',
      enlarge: '🔍 放大查看',

      // Status messages
      status_parsing: '正在解析...',
      status_no_photos: '未找到照片',
      status_photos_loaded: '張照片已載入',
      status_parse_failed: '解析失敗',
      status_reading_photo: '正在解析照片 GPS...',
      status_read_failed: '讀取失敗',
      status_gps_failed: 'GPS 解析失敗',

      // Toast messages
      toast_point_marked: '✅ 已在地圖上標記點位',
      toast_no_photos_in_zip: '壓縮包中未找到 JPEG 或 HEIC 格式的圖片檔案',
      toast_found_photos: '找到',
      toast_parsing_exif: '張照片，正在解析 EXIF...',
      toast_updating_map: '正在更新地圖...',
      toast_done: '完成! 已載入',
      toast_done2: '完成! 共載入',
      toast_load_success_1: '✅ 成功載入',
      toast_load_success_2: '張照片，其中',
      toast_load_success_3: '張含有 GPS 坐標',
      toast_load_success_4: '張含有 GPS 坐標，已標註到地圖',
      toast_no_gps_1: '⚠️ 載入了',
      toast_no_gps_2: '張照片，但未檢測到 GPS 坐標（照片可能未開啟定位）',
      toast_parse_failed_photo: '❌ 照片解析失敗: ',
      toast_parse_failed_zip: '❌ 壓縮包解析失敗: ',
      toast_invalid_format: '❌ 請上傳 .jpg、.jpeg 或 .heic 格式的照片',
      toast_mixed_upload: '⚠️ 請不要混合上傳壓縮包和照片，請分開上傳',
      toast_invalid_files: '❌ 請上傳 .zip 壓縮包或 .jpg/.jpeg/.heic 照片',
      toast_route_added_1: '已添加',
      toast_route_added_2: '，請設定起點和終點',
      toast_route_deleted_1: '已刪除',
      toast_point_deleted: '已刪除該點位',
      toast_route_cleared_1: '已清空',
      toast_route_cleared_2: '的所有點位',
      toast_all_routes_cleared: '已清除所有路線',
      toast_select_route_first: '請先添加或選擇一條路線',
      toast_parsing_gps: '📷 正在解析照片中的 GPS 坐標...',
      toast_no_gps_in_photo: '❌ 照片未檢測到 GPS 坐標，請確認拍照時已開啟定位',
      toast_gps_success_1: '✅ 已從照片提取 GPS 並設為',
      toast_gps_success_2: '的',
      toast_read_photo_failed: '❌ 讀取照片失敗',
      toast_recalc_done: '已重新計算路徑',
      toast_select_point_1: '請在地圖上點擊選擇',
      toast_select_point_2: '的',
      toast_need_2_points: '至少需要 2 個點位（照片坐標或路線點）才能構建圖',
      toast_complete_graph_1: '完全圖已構建: ',
      toast_complete_graph_2: ' 個節點',
      toast_knn_graph_1: 'KNN 圖已構建 (K=',
      toast_knn_graph_2: '): ',
      toast_knn_graph_3: ' 個節點',
      toast_no_exportable: '沒有可匯出的帶坐標照片',
      toast_export_success_1: '✅ 已匯出',
      toast_export_success_2: ' 條記錄為 ',
      toast_export_success_3: ' 格式',
      toast_export_failed: '❌ 匯出失敗，請重試',
      export_preparing: '⏳ 正在產生匯出檔案（含照片壓縮）...',
      export_kml_docname: '旅遊日記 · 旅行軌跡',
      export_track: '軌跡',
      export_all_btn: '🗺️ 匯出全部 (KML)',
      export_all_desc: '一次性把「旅遊日記」（照片軌跡 + 序號地點 + 照片）和「旅遊規劃」（路線 + 序號地點）全部合併匯出為一個 KML，可在 Google Earth、ArcGIS 中開啟。',
      export_all_docname: '全部旅行資料 · 日記與規劃',
      export_all_planner: '旅遊規劃',
      export_all_empty: '沒有可匯出的內容（請先上傳帶定位的照片，或新增規劃路線）',
      export_place: '地點',
      export_photo_limit: '張（其餘未內嵌，避免檔案過大）',
      toast_map_settings_updated: '✅ 地圖設定已更新',
      toast_tdt_key_needed: '天地圖需要填寫有效 Key，已暫時改用高德底圖',

      // Route info
      route_info_start: '起點',
      route_info_end: '終點',
      route_info_waypoints: '途經點',
      route_info_waypoints_unit: '個',
      route_info_nodes: '路徑節點',
      route_info_distance: '總距離',
      route_info_algo: '算法',
      route_info_status_set: '起點→',
      route_info_status_waypoints: '途經→終點',
      route_info_status_start_only: '僅起點',
      route_info_status_end_only: '僅終點',
      route_info_status_empty: '未設定',

      // Misc
      no_matching_photos: '沒有符合條件的照片',
      no_gps_badge: '無坐標',
      waypoint_label: '途經',
      km: '公里',
      m: '米',

      // 模式切換
      mode_planner: '旅遊規劃',
      mode_diary: '旅遊日記',
      mode_switched_planner: '🗺️ 已切換到旅遊規劃模式',
      mode_switched_diary: '📸 已切換到旅行日記模式',

      // 旅行規劃
      planner_tab: '🗺️ 旅行規劃',
      planner_search_title: '搜索地點',
      planner_search_placeholder: '輸入地點名稱，如：天安門',
      planner_search_btn: '搜索',
      planner_searching: '搜索中...',
      planner_search_failed: '搜索失敗，請檢查網絡後重試',
      planner_search_no_result: '未找到該地點，請換個關鍵詞試試',
      planner_places_title: '地點列表',
      planner_click_hint: '💡 也可以直接點擊地圖添加地點。每個地點可設定角色：起點 / 景點 / 終點。',
      planner_empty_list: '暫無地點，請搜索或點擊地圖添加',
      planner_map_place: '地圖點',
      planner_role_start: '起點',
      planner_role_end: '終點',
      planner_role_attraction: '景點',
      planner_transport: '出行方式',
      planner_walk: '步行',
      planner_drive: '駕車',
      planner_plan_btn: '⚡ 計算最優路線',
      planner_clear_btn: '🗑️ 清除路線',
      planner_result_title: '最優路線結果',
      planner_need_more_places: '至少需要 2 個地點才能規劃路線',
      planner_calculating: '正在計算最優路線，請稍候...',
      planner_calc_failed: '路線計算失敗，請稍後重試',
      planner_total_distance: '總距離',
      planner_total_time: '預計時間',
      planner_visit_order: '訪問順序',
      planner_leg_distance: '距上一站',
      planner_place_added: '✅ 已添加地點',
      planner_cleared: '已清除當前路線的所有地點',
      planner_export_title: '導出規劃路線',
      planner_export_desc: '把規劃好的地點和路線導出，可在 Google Earth、ArcGIS 等軟件中打開。已計算過最優路線的，會導出真實道路軌跡。',
      planner_export_kml_docname: '旅遊規劃路線',
      planner_export_empty: '暫無規劃路線可導出',
      planner_export_unit: '個地點',
      planner_export_none: '還沒有規劃路線，先添加地點並計算路線吧',
      planner_export_routes: '條路線',
      planner_export_tracks: '條軌跡',
      planner_usage_title: '使用指南',
      planner_usage_body: '1. 新增路線並命名（可規劃多條路線）<br/>2. 搜索地點或點擊地圖添加地點，把必去景點都加進來<br/>3. 設置起點（如酒店）、終點（可設為起點作往返）<br/>4. 選擇步行或駕車，點擊「計算最優路線」<br/>5. 查看總距離、預計時間與訪問順序',
      planner_routes_title: '我的規劃路線',
      planner_routes_desc: '可以規劃多條路線，每條獨立命名、獨立顏色。切換到某條路線後添加的地點都屬於該路線。',
      planner_add_route: '➕ 新增路線',
      planner_route_default: '路線',
      planner_route_name_prompt: '請輸入路線名稱',
      planner_route_rename_prompt: '重命名路線：',
      planner_route_delete_confirm: '確定刪除該規劃路線（路線內的地點會一併刪除）',
      planner_route_empty: '還沒有規劃路線，點擊上方按鈕創建',
      state_restored: '✅ 已恢復上次保存的數據',
      hour_unit: '小時',
      minute_unit: '分鐘',

      // 旅行軌跡（日記模式）
      trace_title: '旅行軌跡',
      trace_desc: '按拍攝時間排序連接所有照片位置，形成真實旅行軌跡。',
      trace_road: '真實道路',
      trace_line: '直線連接',
      trace_draw: '🗺️ 繪製軌跡',
      trace_need_photos: '至少需要 2 張帶 GPS 坐標的照片',
      trace_drawn: '✅ 軌跡繪製完成',

      // 我的行程（多行程）
      trips_title: '我的行程',
      trips_desc: '創建行程後，上傳的照片會歸入當前選中的行程。每個行程有獨立的顏色和軌跡。',
      add_trip: '➕ 新增行程',
      trip_default_name: '行程',
      trip_name_prompt: '請輸入行程名稱',
      trip_delete_confirm: '確定刪除行程（行程內的照片會保留）',
      trip_empty: '還沒有行程，點擊下方按鈕創建',
      trip_active_badge: '當前',
      trip_switched: '已切換到行程',
      trip_ungrouped: '未分組照片',
      trip_locations_unit: '個地點',
      rename: '重命名'
    },

    'en': {
      // Top bar
      app_title: 'PhotoTrail',
      app_subtitle: 'Relive every journey on the map',
      app_title_planner: 'Trip Planner',
      app_title_diary: 'Travel Diary',
      app_subtitle_planner: 'Plan the optimal route to all your places',
      app_subtitle_diary: 'Upload photos to trace your journey on the map',
      upload_btn: 'Upload Photos/ZIP',
      status_ready: 'Ready',
      lang_label: 'Language',

      // Tabs
      tab_photos: 'Photos',
      tab_path: 'Routes',
      tab_export: 'Export',
      tab_settings: 'Settings',

      // Photos tab
      photo_list: 'Photo List',
      photos_unit: 'photos',
      stat_total: 'Total Photos',
      stat_gps: 'Geotagged',
      stat_nogps: 'No GPS',
      stat_daterange: 'Date Range',
      date_filter: 'Date Filter',
      start_date: 'Start Date',
      end_date: 'End Date',
      gps_status: 'GPS Status',
      filter_all: 'All',
      filter_yes: 'Has GPS',
      filter_no: 'No GPS',
      apply_filter: 'Apply Filter',

      // Path tab
      multi_route: 'Multi-Route Planning',
      route_desc: 'Support adding multiple routes, each with independent start, waypoints, and end points, distinguished by different colors. Click a route to edit its points, each point can be deleted anytime.',
      add_route: 'Add New Route',
      path_info: 'Route Info',
      path_detail_placeholder: 'Add routes and set start/end points to auto-calculate paths',
      graph_build: 'Graph Build',
      graph_desc: 'Use K-nearest neighbor algorithm to build graph structure of all points (photos + route points)',
      k_value: 'K Value (Neighbors)',
      build_knn: 'Build KNN Graph',
      build_complete: 'Build Complete Graph',

      // Route controls
      route_name_prefix: 'Route',
      map_point_prefix: 'Map Point',
      start_point: 'Start',
      end_point: 'End',
      waypoint_point: 'Waypoint',
      start_point_icon: '🟢 Start',
      end_point_icon: '🔴 End',
      waypoints_icon: 'Waypoints',
      map_select: '📍 Map Select',
      photo_select: '📷 Photo Select',
      map_add: '📍 Map Add',
      photo_add: '📷 Photo Add',
      start_not_set: 'Start not set',
      end_not_set: 'End not set',
      no_waypoints: 'No waypoints',
      recalc: '🧮 Recalculate',
      clear_route: '🗑️ Clear Route',
      delete_btn: 'Delete',
      show: 'Show',
      hide: 'Hide',
      delete_photo: 'Delete this photo',
      delete_photo_confirm: 'Delete this photo? This cannot be undone:',
      photo_deleted: '✅ Photo deleted',
      no_routes: 'No routes yet, click button below to add',
      add_route_first: 'Please add a route first',

      // Export tab
      data_export: 'Data Export',
      export_desc: 'Export photo location data to common GIS formats, can be opened in other map software.',
      export_stats: 'Export Stats',
      exportable_count: 'Exportable Geotagged Photos',

      // Settings tab
      map_settings: 'Map Settings',
      tianditu_key: 'Tianditu API Key',
      tianditu_key_placeholder: 'Enter Tianditu API Key',
      tianditu_hint: 'Visit',
      tianditu_link: 'Tianditu website',
      tianditu_hint2: 'to register and get key',
      amap_key: 'AMap API Key (optional)',
      amap_key_placeholder: 'Fill in to use AMap for search and routing',
      amap_hint: 'Once set, place search and route planning use AMap (China); leave empty to use OpenStreetMap.',
      amap_link: 'Get free key',
      amap_key_active: 'AMap enabled: search and routing use domestic service',
      amap_key_inactive: 'Not enabled, currently using international OpenStreetMap service',
      amap_key_saved: '✅ AMap key saved and enabled',
      amap_key_cleared: 'AMap key cleared, reverted to international service',
      map_layer: 'Map Layer',
      map_vec: 'Vector Map',
      map_img: 'Satellite Imagery',
      apply_map_settings: 'Apply Map Settings',
      basemap_provider: 'Basemap source',
      basemap_amap: 'AMap (no key needed)',
      basemap_tianditu: 'Tianditu (key required)',
      basemap_hint: 'AMap tiles need no key and load fast in China. Remember to click Apply below.',
      map_layer_style: 'Layer style',
      about: 'About',
      about_text: 'PhotoTrail v1.0',
      about_desc: 'Built with Leaflet + AMap, using JSZip for decompression, pure frontend EXIF parsing.',
      about_algo: 'Graph algorithms: Dijkstra, A*, Floyd-Warshall, Prim, TSP approximation.',

      // Gallery
      gallery_empty: 'Upload a .zip file with travel photos or single .jpg/.heic photos to start',

      // Drag overlay
      drag_title: 'Drop to Upload',
      drag_desc: 'Supports .zip or .jpg/.heic files',

      // Progress
      processing: 'Processing...',
      parsing_heic_1: 'Parsing ',
      parsing_heic_2: ' photos (HEIC conversion, please wait)...',
      parsing_exif_1: 'Parsing EXIF for ',
      parsing_exif_2: ' photos...',
      altitude_label: 'Altitude',

      // Photo popup
      no_preview_heic: 'No preview (HEIC)',
      no_preview: 'No preview',
      enlarge: '🔍 View Full Size',

      // Status messages
      status_parsing: 'Parsing...',
      status_no_photos: 'No photos found',
      status_photos_loaded: 'photos loaded',
      status_parse_failed: 'Parse failed',
      status_reading_photo: 'Parsing photo GPS...',
      status_read_failed: 'Read failed',
      status_gps_failed: 'GPS parse failed',

      // Toast messages
      toast_point_marked: '✅ Point marked on map',
      toast_no_photos_in_zip: 'No JPEG or HEIC images found in ZIP file',
      toast_found_photos: 'Found',
      toast_parsing_exif: ' photos, parsing EXIF...',
      toast_updating_map: 'Updating map...',
      toast_done: 'Done! Loaded',
      toast_done2: 'Done! Loaded',
      toast_load_success_1: '✅ Successfully loaded',
      toast_load_success_2: ' photos, ',
      toast_load_success_3: ' with GPS coordinates',
      toast_load_success_4: ' with GPS coordinates, marked on map',
      toast_no_gps_1: '⚠️ Loaded',
      toast_no_gps_2: ' photos, but no GPS detected (location may be disabled)',
      toast_parse_failed_photo: '❌ Photo parse failed: ',
      toast_parse_failed_zip: '❌ ZIP parse failed: ',
      toast_invalid_format: '❌ Please upload .jpg, .jpeg or .heic photos',
      toast_mixed_upload: '⚠️ Please do not mix ZIP and photos, upload separately',
      toast_invalid_files: '❌ Please upload .zip or .jpg/.jpeg/.heic files',
      toast_route_added_1: 'Added',
      toast_route_added_2: ', please set start and end points',
      toast_route_deleted_1: 'Deleted',
      toast_point_deleted: 'Point deleted',
      toast_route_cleared_1: 'Cleared all points of',
      toast_route_cleared_2: '',
      toast_all_routes_cleared: 'All routes cleared',
      toast_select_route_first: 'Please add or select a route first',
      toast_parsing_gps: '📷 Parsing GPS from photo...',
      toast_no_gps_in_photo: '❌ No GPS detected in photo, ensure location is enabled when taking photos',
      toast_gps_success_1: '✅ GPS extracted from photo, set as',
      toast_gps_success_2: "'s ",
      toast_read_photo_failed: '❌ Failed to read photo',
      toast_recalc_done: 'Route recalculated',
      toast_select_point_1: 'Click on map to select',
      toast_select_point_2: "'s ",
      toast_need_2_points: 'Need at least 2 points (photo coordinates or route points) to build graph',
      toast_complete_graph_1: 'Complete graph built: ',
      toast_complete_graph_2: ' nodes',
      toast_knn_graph_1: 'KNN graph built (K=',
      toast_knn_graph_2: '): ',
      toast_knn_graph_3: ' nodes',
      toast_no_exportable: 'No exportable geotagged photos',
      toast_export_success_1: '✅ Exported',
      toast_export_success_2: ' records as ',
      toast_export_success_3: ' format',
      toast_export_failed: '❌ Export failed, please retry',
      export_preparing: '⏳ Preparing export (compressing photos)...',
      export_kml_docname: 'Travel Diary · Trip Track',
      export_track: 'Track',
      export_all_btn: '🗺️ Export All (KML)',
      export_all_desc: 'Merge and export everything — the Travel Diary (photo tracks + numbered places + photos) and the Travel Planner (routes + numbered stops) — into a single KML, openable in Google Earth, ArcGIS, etc.',
      export_all_docname: 'All Travel Data · Diary & Planner',
      export_all_planner: 'Travel Planner',
      export_all_empty: 'Nothing to export yet (upload geotagged photos or add planner routes first)',
      export_place: 'Place',
      export_photo_limit: 'shown (rest omitted to limit file size)',
      toast_map_settings_updated: '✅ Map settings updated',
      toast_tdt_key_needed: 'Tianditu requires a valid key, using AMap basemap for now',

      // Route info
      route_info_start: 'Start',
      route_info_end: 'End',
      route_info_waypoints: 'Waypoints',
      route_info_waypoints_unit: '',
      route_info_nodes: 'Path Nodes',
      route_info_distance: 'Total Distance',
      route_info_algo: 'Algorithm',
      route_info_status_set: 'Start→',
      route_info_status_waypoints: 'WP→End',
      route_info_status_start_only: 'Start only',
      route_info_status_end_only: 'End only',
      route_info_status_empty: 'Not set',

      // Misc
      no_matching_photos: 'No matching photos',
      no_gps_badge: 'No GPS',
      waypoint_label: 'WP',
      km: 'km',
      m: 'm',

      // Mode switch
      mode_planner: 'Trip Planner',
      mode_diary: 'Travel Diary',
      mode_switched_planner: '🗺️ Switched to Trip Planner mode',
      mode_switched_diary: '📸 Switched to Travel Diary mode',

      // Trip Planner
      planner_tab: '🗺️ Trip Planner',
      planner_search_title: 'Search Places',
      planner_search_placeholder: 'Enter a place name, e.g. Tiananmen',
      planner_search_btn: 'Search',
      planner_searching: 'Searching...',
      planner_search_failed: 'Search failed, please check your network and retry',
      planner_search_no_result: 'Place not found, try another keyword',
      planner_places_title: 'Place List',
      planner_click_hint: '💡 You can also click the map to add places. Each place can be set as: Start / Attraction / End.',
      planner_empty_list: 'No places yet, search or click the map to add',
      planner_map_place: 'Map Point',
      planner_role_start: 'Start',
      planner_role_end: 'End',
      planner_role_attraction: 'Attraction',
      planner_transport: 'Transport',
      planner_walk: 'Walk',
      planner_drive: 'Drive',
      planner_plan_btn: '⚡ Plan Optimal Route',
      planner_clear_btn: '🗑️ Clear All',
      planner_result_title: 'Optimal Route Result',
      planner_need_more_places: 'At least 2 places are needed to plan a route',
      planner_calculating: 'Calculating optimal route, please wait...',
      planner_calc_failed: 'Route calculation failed, please retry later',
      planner_total_distance: 'Total Distance',
      planner_total_time: 'Est. Time',
      planner_visit_order: 'Visit Order',
      planner_leg_distance: 'from previous',
      planner_place_added: '✅ Place added',
      planner_cleared: 'Current route cleared',
      planner_export_title: 'Export Planned Route',
      planner_export_desc: 'Export your planned places and routes to open in Google Earth, ArcGIS, etc. If an optimal route has been calculated, the real road track is exported.',
      planner_export_kml_docname: 'Travel Planner Routes',
      planner_export_empty: 'No planned route to export',
      planner_export_unit: 'places',
      planner_export_none: 'No route yet — add places and calculate a route first',
      planner_export_routes: 'routes',
      planner_export_tracks: 'tracks',
      planner_usage_title: 'How to Use',
      planner_usage_body: '1. Create and name a route (multiple allowed)<br/>2. Search a place or click the map to add places<br/>3. Set the start (e.g. hotel) and end point (end can be the start for a round trip)<br/>4. Choose walking or driving, then tap "Calculate optimal route"<br/>5. See total distance, estimated time and visit order',
      planner_routes_title: 'My Planned Routes',
      planner_routes_desc: 'Plan multiple routes, each with its own name and color. Places you add belong to the currently selected route.',
      planner_add_route: '➕ New Route',
      planner_route_default: 'Route',
      planner_route_name_prompt: 'Enter route name',
      planner_route_rename_prompt: 'Rename route:',
      planner_route_delete_confirm: 'Delete this route? (its places will be removed)',
      planner_route_empty: 'No routes yet. Click the button above to create one.',
      state_restored: '✅ Saved data restored',
      hour_unit: 'h ',
      minute_unit: 'min',

      // Travel Trace (Diary mode)
      trace_title: 'Travel Trace',
      trace_desc: 'Connect all photo locations in shooting-time order to form your real travel trace.',
      trace_road: 'Real Roads',
      trace_line: 'Straight Lines',
      trace_draw: '🗺️ Draw Trace',
      trace_need_photos: 'At least 2 photos with GPS coordinates are needed',
      trace_drawn: '✅ Trace drawn',

      // My Trips (multi-trip diary)
      trips_title: 'My Trips',
      trips_desc: 'After creating a trip, uploaded photos belong to the currently selected trip. Each trip has its own color and trace.',
      add_trip: '➕ New Trip',
      trip_default_name: 'Trip',
      trip_name_prompt: 'Enter trip name',
      trip_delete_confirm: 'Delete this trip? (photos inside will be kept)',
      trip_empty: 'No trips yet. Click the button below to create one.',
      trip_active_badge: 'Current',
      trip_switched: 'Switched to trip',
      trip_ungrouped: 'Ungrouped Photos',
      trip_locations_unit: 'places',
      rename: 'Rename'
    }
  };

  var LANG_LIST = [
    { code: 'zh-CN', label: '中文', short: '中' },
    { code: 'zh-HK', label: '繁中', short: '繁' },
    { code: 'en', label: 'English', short: 'EN' }
  ];

  function t(key) {
    var lang = translations[currentLang] || translations['zh-CN'];
    return lang[key] !== undefined ? lang[key] : (translations['zh-CN'][key] !== undefined ? translations['zh-CN'][key] : key);
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('app_lang', lang);
  }

  function getLangList() {
    return LANG_LIST;
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   * Called after language switch and on page load
   */
  function applyTranslations() {
    // Update elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text = t(key);
      el.textContent = text;
    });

    // Update elements with data-i18n-html (allows HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      el.innerHTML = t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });

    // Update document title
    document.title = t('app_title') + ' · ' + t('app_subtitle');

    // Update html lang attribute
    document.documentElement.lang = currentLang;

    // Update language switcher button text
    var langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
      var langInfo = LANG_LIST.find(function (l) { return l.code === currentLang; });
      if (langInfo) {
        langBtn.textContent = langInfo.short;
      }
    }

    // Update language dropdown options
    var dropdown = document.getElementById('langDropdown');
    if (dropdown) {
      dropdown.querySelectorAll('.lang-option').forEach(function (opt) {
        if (opt.dataset.lang === currentLang) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });
    }
  }

  return {
    t: t,
    getLang: getLang,
    setLang: setLang,
    getLangList: getLangList,
    applyTranslations: applyTranslations
  };
})();

// Convenience function for global use
function t(key) {
  return I18N.t(key);
}
