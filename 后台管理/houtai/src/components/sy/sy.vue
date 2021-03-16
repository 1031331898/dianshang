<template>
  <div>
    <div id="echars" style="width: 750px; height: 400px"></div>
    <div class="ad">
      <div id="echars2" style="width: 750px; height: 400px"></div>
      <div id="echars3" style="width: 750px; height: 400px"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import aaa from "./../../request/index";
export default {
  props: {},
  data() {
    return {
      options: {
        title: {
          text: "商品分类数据列表",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data:[],

        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            type: "pie",
            radius: [20, 140],
            center: ["25%", "50%"],
            roseType: "radius",
            itemStyle: {
              borderRadius: 5,
            },
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            data: [],
          },
        ],
      },
      options2: {
        title: {
          text: "角色列表",
        },
        xAxis: {
          type: "category",
          data: [],
          
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
        
      },
      
      options3: {
        title: {
          text: "所有权限列表",
        },
        angleAxis: {
          type: "category",
          data: [],
        },
        radiusAxis: {},
        polar: {},
        series: [
          {
            type: "bar",
            data: [45, 2, 3, 4, 3, 5, 45],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [45, 2, 3, 4, 3, 5, 45],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [45, 2, 3, 4, 3, 5, 45],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [45, 2, 3, 4, 3, 5, 45],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [45, 2, 3, 4, 3, 5, 45],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [45, 2, 54, 4, 54, 5, 45],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [45, 2, 54, 4, 5, 5, 45],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [1, 2, 6, 4, 5, 5, 1],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [1, 2, 5, 4, 8, 5, 1],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [
              1,
              2,
              8,
              4,
              54,
              5,
              1,
              1,
              2,
              8,
              4,
              54,
              5,
              11,
              2,
              8,
              4,
              54,
              5,
              1,
            ],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [1, 2, 54, 4, 3, 5, 1],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [1, 2, 3, 4, 3, 5, 1],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [1, 2, 3, 4, 3, 5, 1],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
          {
            type: "bar",
            data: [1, 2, 3, 4, 3, 5, 1],
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
            emphasis: {
              focus: "series",
            },
          },
        ],
        legend: {
          show: true,
          data: [],
        },
      },
    };
  },

  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("echars"));
    var myChart2 = echarts.init(document.getElementById("echars2"));
    var myChart3 = echarts.init(document.getElementById("echars3"));

    aaa({
      url: "/categories",
    }).then((res) => {
      res.data.forEach((element) => {
        this.options.legend.data.push(element.cat_name);
        this.options.series[0].data.push({
          value: element.cat_id,
          name: element.cat_name,
        });
      });
      this.options && myChart.setOption(this.options);
    });

    aaa({
      url: "/roles",
    }).then((rew) => {
      rew.data.forEach((element) => {
        this.options2.xAxis.data.push(element.roleName);
        this.options2.series[0].data.push(element.id);
      });
      this.options2 && myChart2.setOption(this.options2);
    });

    aaa({
      url: "rights/list ",
    }).then((res) => {
      console.log(res);
      res.data.forEach((element) => {
        console.log(element);
        this.options3.angleAxis.data.push(element.authName);
        this.options3.legend.data.push(element.path);
      });
      this.options3 && myChart3.setOption(this.options3);
    });
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="less">
#echars{
  position: relative;
  left: 50%;
  transform: translate(-50%);
}
.ad {
  display: flex;
}
</style>
