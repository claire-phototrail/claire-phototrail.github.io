(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ShortestPath = factory();
  }
}(this, function () {
  'use strict';

  function ShortestPath() {}

  var EARTH_RADIUS_KM = 6371.0;

  function toRad(deg) {
    return deg * Math.PI / 180;
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
  }

  function PriorityQueue() {
    this.heap = [];
  }

  PriorityQueue.prototype = {
    push: function (item, priority) {
      this.heap.push({ item: item, priority: priority });
      this._bubbleUp(this.heap.length - 1);
    },

    pop: function () {
      if (this.heap.length === 0) return null;
      var top = this.heap[0];
      var bottom = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = bottom;
        this._sinkDown(0);
      }
      return top.item;
    },

    peek: function () {
      return this.heap.length > 0 ? this.heap[0].item : null;
    },

    size: function () {
      return this.heap.length;
    },

    isEmpty: function () {
      return this.heap.length === 0;
    },

    _bubbleUp: function (idx) {
      while (idx > 0) {
        var parentIdx = Math.floor((idx - 1) / 2);
        if (this.heap[idx].priority >= this.heap[parentIdx].priority) break;
        this._swap(idx, parentIdx);
        idx = parentIdx;
      }
    },

    _sinkDown: function (idx) {
      var length = this.heap.length;
      while (true) {
        var leftChildIdx = 2 * idx + 1;
        var rightChildIdx = 2 * idx + 2;
        var smallest = idx;

        if (leftChildIdx < length && this.heap[leftChildIdx].priority < this.heap[smallest].priority) {
          smallest = leftChildIdx;
        }
        if (rightChildIdx < length && this.heap[rightChildIdx].priority < this.heap[smallest].priority) {
          smallest = rightChildIdx;
        }
        if (smallest === idx) break;
        this._swap(idx, smallest);
        idx = smallest;
      }
    },

    _swap: function (i, j) {
      var temp = this.heap[i];
      this.heap[i] = this.heap[j];
      this.heap[j] = temp;
    }
  };

  function Graph() {
    this.nodes = {};
    this.edges = {};
  }

  Graph.prototype = {
    addNode: function (id, data) {
      if (!this.nodes[id]) {
        this.nodes[id] = data || {};
        this.edges[id] = {};
      }
      return this;
    },

    addEdge: function (fromId, toId, weight, data) {
      this.addNode(fromId);
      this.addNode(toId);

      if (weight === undefined || weight === null) {
        var fromNode = this.nodes[fromId];
        var toNode = this.nodes[toId];
        if (fromNode && toNode &&
            fromNode.latitude !== undefined && fromNode.longitude !== undefined &&
            toNode.latitude !== undefined && toNode.longitude !== undefined) {
          weight = haversineDistance(
            fromNode.latitude, fromNode.longitude,
            toNode.latitude, toNode.longitude
          );
        } else {
          weight = 0;
        }
      }

      this.edges[fromId][toId] = { weight: weight, data: data || {} };
      this.edges[toId][fromId] = { weight: weight, data: data || {} };
      return this;
    },

    addDirectedEdge: function (fromId, toId, weight, data) {
      this.addNode(fromId);
      this.addNode(toId);

      if (weight === undefined || weight === null) {
        var fromNode = this.nodes[fromId];
        var toNode = this.nodes[toId];
        if (fromNode && toNode &&
            fromNode.latitude !== undefined && fromNode.longitude !== undefined &&
            toNode.latitude !== undefined && toNode.longitude !== undefined) {
          weight = haversineDistance(
            fromNode.latitude, fromNode.longitude,
            toNode.latitude, toNode.longitude
          );
        } else {
          weight = 0;
        }
      }

      this.edges[fromId][toId] = { weight: weight, data: data || {} };
      return this;
    },

    removeNode: function (id) {
      delete this.nodes[id];
      delete this.edges[id];
      for (var nodeId in this.edges) {
        if (this.edges[nodeId][id]) {
          delete this.edges[nodeId][id];
        }
      }
      return this;
    },

    getNeighbors: function (id) {
      var neighbors = [];
      var edgeList = this.edges[id];
      if (edgeList) {
        for (var neighborId in edgeList) {
          neighbors.push({
            id: neighborId,
            weight: edgeList[neighborId].weight,
            data: edgeList[neighborId].data
          });
        }
      }
      return neighbors;
    },

    getNodeCount: function () {
      return Object.keys(this.nodes).length;
    },

    getEdgeCount: function () {
      var count = 0;
      for (var id in this.edges) {
        count += Object.keys(this.edges[id]).length;
      }
      return count / 2;
    },

    getNodeIds: function () {
      return Object.keys(this.nodes);
    },

    getNodeData: function (id) {
      return this.nodes[id] || null;
    },

    hasNode: function (id) {
      return !!this.nodes[id];
    },

    buildCompleteGraph: function (nodeIds) {
      var self = this;
      nodeIds = nodeIds || this.getNodeIds();
      for (var i = 0; i < nodeIds.length; i++) {
        for (var j = i + 1; j < nodeIds.length; j++) {
          self.addEdge(nodeIds[i], nodeIds[j]);
        }
      }
      return this;
    },

    buildNearestNeighborGraph: function (k, nodeIds) {
      var self = this;
      nodeIds = nodeIds || this.getNodeIds();

      for (var i = 0; i < nodeIds.length; i++) {
        var distances = [];
        for (var j = 0; j < nodeIds.length; j++) {
          if (i === j) continue;
          var nodeI = this.nodes[nodeIds[i]];
          var nodeJ = this.nodes[nodeIds[j]];
          if (nodeI && nodeJ &&
              nodeI.latitude !== undefined && nodeI.longitude !== undefined &&
              nodeJ.latitude !== undefined && nodeJ.longitude !== undefined) {
            var dist = haversineDistance(
              nodeI.latitude, nodeI.longitude,
              nodeJ.latitude, nodeJ.longitude
            );
            distances.push({ id: nodeIds[j], distance: dist });
          }
        }

        distances.sort(function (a, b) { return a.distance - b.distance; });

        var limit = Math.min(k, distances.length);
        for (var m = 0; m < limit; m++) {
          self.addEdge(nodeIds[i], distances[m].id, distances[m].distance);
        }
      }

      return this;
    }
  };

  function reconstructPath(cameFrom, start, end) {
    var path = [];
    var current = end;

    while (current !== undefined && current !== null) {
      path.unshift(current);
      current = cameFrom[current];
    }

    if (path.length === 0 || path[0] !== start) {
      return [];
    }

    return path;
  }

  ShortestPath.prototype = {
    Graph: Graph,

    haversineDistance: haversineDistance,

    /**
     * Dijkstra 最短路径算法
     * 适用于非负权重的有向/无向图
     * 时间复杂度: O((V + E) log V) 使用优先队列优化
     *
     * @param {Graph} graph - 图对象
     * @param {string} startId - 起点节点 ID
     * @param {string} endId - 终点节点 ID
     * @returns {Object} { path: string[], distance: number }
     */
    dijkstra: function (graph, startId, endId) {
      if (!graph.hasNode(startId) || !graph.hasNode(endId)) {
        return { path: [], distance: Infinity };
      }

      var distances = {};
      var cameFrom = {};
      var pq = new PriorityQueue();

      var allNodes = graph.getNodeIds();
      for (var i = 0; i < allNodes.length; i++) {
        distances[allNodes[i]] = Infinity;
      }
      distances[startId] = 0;

      pq.push(startId, 0);

      while (!pq.isEmpty()) {
        var current = pq.pop();

        if (current === endId) {
          return {
            path: reconstructPath(cameFrom, startId, endId),
            distance: distances[endId]
          };
        }

        var currentDist = distances[current];
        var neighbors = graph.getNeighbors(current);

        for (var j = 0; j < neighbors.length; j++) {
          var neighbor = neighbors[j];
          var newDist = currentDist + neighbor.weight;

          if (newDist < distances[neighbor.id]) {
            distances[neighbor.id] = newDist;
            cameFrom[neighbor.id] = current;
            pq.push(neighbor.id, newDist);
          }
        }
      }

      return { path: [], distance: Infinity };
    },

    /**
     * A* 最短路径算法
     * 使用启发式函数 (Haversine 距离) 加速搜索
     * 在 Dijkstra 基础上加入启发式估计
     *
     * @param {Graph} graph - 图对象
     * @param {string} startId - 起点节点 ID
     * @param {string} endId - 终点节点 ID
     * @returns {Object} { path: string[], distance: number }
     */
    astar: function (graph, startId, endId) {
      if (!graph.hasNode(startId) || !graph.hasNode(endId)) {
        return { path: [], distance: Infinity };
      }

      var endNode = graph.getNodeData(endId);
      if (!endNode || endNode.latitude === undefined || endNode.longitude === undefined) {
        return this.dijkstra(graph, startId, endId);
      }

      var gScore = {};
      var fScore = {};
      var cameFrom = {};
      var openSet = new PriorityQueue();

      var allNodes = graph.getNodeIds();
      for (var i = 0; i < allNodes.length; i++) {
        gScore[allNodes[i]] = Infinity;
        fScore[allNodes[i]] = Infinity;
      }
      gScore[startId] = 0;

      var startNode = graph.getNodeData(startId);
      if (startNode && startNode.latitude !== undefined && startNode.longitude !== undefined) {
        fScore[startId] = haversineDistance(
          startNode.latitude, startNode.longitude,
          endNode.latitude, endNode.longitude
        );
      } else {
        fScore[startId] = 0;
      }

      openSet.push(startId, fScore[startId]);

      while (!openSet.isEmpty()) {
        var current = openSet.pop();

        if (current === endId) {
          return {
            path: reconstructPath(cameFrom, startId, endId),
            distance: gScore[endId]
          };
        }

        var neighbors = graph.getNeighbors(current);

        for (var j = 0; j < neighbors.length; j++) {
          var neighbor = neighbors[j];
          var tentativeGScore = gScore[current] + neighbor.weight;

          if (tentativeGScore < gScore[neighbor.id]) {
            cameFrom[neighbor.id] = current;
            gScore[neighbor.id] = tentativeGScore;

            var neighborNode = graph.getNodeData(neighbor.id);
            var heuristic = 0;
            if (neighborNode && neighborNode.latitude !== undefined && neighborNode.longitude !== undefined) {
              heuristic = haversineDistance(
                neighborNode.latitude, neighborNode.longitude,
                endNode.latitude, endNode.longitude
              );
            }

            fScore[neighbor.id] = tentativeGScore + heuristic;
            openSet.push(neighbor.id, fScore[neighbor.id]);
          }
        }
      }

      return { path: [], distance: Infinity };
    },

    /**
     * 自动选择算法：节点数多于 100 时使用 A*，否则使用 Dijkstra
     * @param {Graph} graph
     * @param {string} startId
     * @param {string} endId
     * @returns {Object}
     */
    findShortestPath: function (graph, startId, endId) {
      var nodeCount = graph.getNodeCount();
      if (nodeCount > 100) {
        return this.astar(graph, startId, endId);
      } else {
        return this.dijkstra(graph, startId, endId);
      }
    },

    /**
     * Floyd-Warshall 全源最短路径算法
     * 适用于节点较少的图（< 200 节点）
     * 时间复杂度: O(V^3)
     *
     * @param {Graph} graph
     * @returns {Object} { distances: Object, next: Object }
     */
    floydWarshall: function (graph) {
      var nodeIds = graph.getNodeIds();
      var n = nodeIds.length;
      var idxMap = {};
      var idMap = {};

      for (var i = 0; i < n; i++) {
        idxMap[nodeIds[i]] = i;
        idMap[i] = nodeIds[i];
      }

      var dist = [];
      var next = [];
      for (var i = 0; i < n; i++) {
        dist[i] = [];
        next[i] = [];
        for (var j = 0; j < n; j++) {
          dist[i][j] = (i === j) ? 0 : Infinity;
          next[i][j] = (i === j) ? i : -1;
        }
      }

      for (var i = 0; i < n; i++) {
        var fromId = idMap[i];
        var neighbors = graph.getNeighbors(fromId);
        for (var k = 0; k < neighbors.length; k++) {
          var j = idxMap[neighbors[k].id];
          if (j !== undefined) {
            dist[i][j] = neighbors[k].weight;
            next[i][j] = j;
          }
        }
      }

      for (var k = 0; k < n; k++) {
        for (var i = 0; i < n; i++) {
          for (var j = 0; j < n; j++) {
            if (dist[i][k] + dist[k][j] < dist[i][j]) {
              dist[i][j] = dist[i][k] + dist[k][j];
              next[i][j] = next[i][k];
            }
          }
        }
      }

      var resultDist = {};
      var resultPath = {};

      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          var key = idMap[i] + '->' + idMap[j];
          resultDist[key] = dist[i][j];

          if (dist[i][j] < Infinity) {
            var path = [];
            var cur = i;
            while (cur !== j && cur !== -1) {
              path.push(idMap[cur]);
              cur = next[cur][j];
            }
            if (cur !== -1) {
              path.push(idMap[j]);
            }
            resultPath[key] = path;
          } else {
            resultPath[key] = [];
          }
        }
      }

      return {
        distances: resultDist,
        paths: resultPath,
        getPath: function (fromId, toId) {
          return resultPath[fromId + '->' + toId] || [];
        },
        getDistance: function (fromId, toId) {
          var d = resultDist[fromId + '->' + toId];
          return d !== undefined ? d : Infinity;
        }
      };
    },

    /**
     * 最小生成树 - Prim 算法
     * @param {Graph} graph
     * @returns {Array} [{ from, to, weight }]
     */
    primMST: function (graph) {
      var nodeIds = graph.getNodeIds();
      if (nodeIds.length === 0) return [];

      var visited = {};
      var mst = [];
      var pq = new PriorityQueue();

      visited[nodeIds[0]] = true;
      var initialNeighbors = graph.getNeighbors(nodeIds[0]);
      for (var i = 0; i < initialNeighbors.length; i++) {
        pq.push({ from: nodeIds[0], to: initialNeighbors[i].id, weight: initialNeighbors[i].weight }, initialNeighbors[i].weight);
      }

      while (!pq.isEmpty() && mst.length < nodeIds.length - 1) {
        var edge = pq.pop();
        if (visited[edge.to]) continue;

        visited[edge.to] = true;
        mst.push(edge);

        var neighbors = graph.getNeighbors(edge.to);
        for (var j = 0; j < neighbors.length; j++) {
          if (!visited[neighbors[j].id]) {
            pq.push({ from: edge.to, to: neighbors[j].id, weight: neighbors[j].weight }, neighbors[j].weight);
          }
        }
      }

      return mst;
    },

    /**
     * 旅行商问题近似解 - 最近邻启发式
     * @param {Graph} graph
     * @param {string} startId
     * @returns {Array} 节点访问顺序
     */
    tspNearestNeighbor: function (graph, startId) {
      var unvisited = {};
      var nodeIds = graph.getNodeIds();
      for (var i = 0; i < nodeIds.length; i++) {
        unvisited[nodeIds[i]] = true;
      }

      var tour = [];
      var current = startId;
      tour.push(current);
      delete unvisited[current];

      while (Object.keys(unvisited).length > 0) {
        var neighbors = graph.getNeighbors(current);
        var nearest = null;
        var nearestDist = Infinity;

        for (var j = 0; j < neighbors.length; j++) {
          if (unvisited[neighbors[j].id] && neighbors[j].weight < nearestDist) {
            nearest = neighbors[j].id;
            nearestDist = neighbors[j].weight;
          }
        }

        if (nearest) {
          tour.push(nearest);
          delete unvisited[nearest];
          current = nearest;
        } else {
          var remaining = Object.keys(unvisited);
          if (remaining.length > 0) {
            var fallbackNode = graph.getNodeData(remaining[0]);
            var currNode = graph.getNodeData(current);
            var minDist = Infinity;
            var nearestRemaining = remaining[0];

            for (var k = 0; k < remaining.length; k++) {
              var rNode = graph.getNodeData(remaining[k]);
              if (rNode && currNode &&
                  rNode.latitude !== undefined && currNode.latitude !== undefined) {
                var d = haversineDistance(
                  currNode.latitude, currNode.longitude,
                  rNode.latitude, rNode.longitude
                );
                if (d < minDist) {
                  minDist = d;
                  nearestRemaining = remaining[k];
                }
              }
            }

            tour.push(nearestRemaining);
            delete unvisited[nearestRemaining];
            current = nearestRemaining;
          }
        }
      }

      return tour;
    }
  };

  return new ShortestPath();
}));
