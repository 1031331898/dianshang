<template>
  <div id="sy">
    <el-card id="echars"></el-card>
    <div class="ad">
      <el-card id="echars2"></el-card>
      <el-card id="echars3"></el-card>
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
          data: [],
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

      // 2
    options2 : {
      title:{
        text:'角色列表',
      },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        data:[]
    },
    series: [
          {
            name: '访问来源',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
                position: 'inner',
                fontSize: 14,
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 1548, name: '权限'},
                {value: 775, name: '分类'},
                {value: 679, name: '饼图', selected: true}
            ]
        },
        {
            name: '访问来源',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
                length: 30,
            },
            label: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}    ',
                backgroundColor: '#F6F8FC',
                borderColor: '#8C8D8E',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                    a: {
                        color: '#6E7079',
                        lineHeight: 22,
                        align: 'center'
                    },
                    hr: {
                        borderColor: '#8C8D8E',
                        width: '100%',
                        borderWidth: 1,
                        height: 0
                    },
                    b: {
                        color: '#4C5058',
                        fontSize: 14,
                        fontWeight: 'bold',
                        lineHeight: 33
                    },
                    per: {
                        color: '#fff',
                        backgroundColor: '#4C5058',
                        padding: [3, 4],
                        borderRadius: 4
                    }
                }
            },
            data: []
        }
    ]
},

      options3: {
        
      title: {
          text: "权限列表",
        },
    legend: {
        type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
        
        
    },
    toolbox: {
        show: true,
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    series: [
        {
            label:{
          shou:false
        },
            name: '面积模式',
            type: 'pie',
            radius: [20, 140],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8
            },
            data: [
                
            ]
        }
    ]
      },
    };
  },

  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("echars"));
    var myChart2 = echarts.init(document.getElementById("echars2"));
    var myChart3 = echarts.init(document.getElementById("echars3"));
    console.log(typeof(this.options2.series[1].data))
    console.log(typeof(this.options2.legend.data))
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
        console.log(element.roleName)
        this.options2.series[1].data.push({name:element.roleName,value:element.id})
      });
      this.options2 && myChart2.setOption(this.options2);
    });

    aaa({
      url: "rights/list ",
    }).then((res) => {
      console.log(res);
      console.log(this.options3.series[0])
      res.data.forEach((element) => {
        // console.log(element);
      
        this.options3.series[0].data.push(
          {name:element.authName,value:element.id}
          );
        // this.options3.legend.data.push(element.path);
      });
      this.options3 && myChart3.setOption(this.options3);
    });
    window.addEventListener("resize", function () {
      myChart.resize();
      myChart2.resize();
      myChart3.resize();
      });
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="less">
#sy {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  // padding: 20px;
  box-sizing: border-box;
}
#echars {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // padding: 20px;
}
.ad {
  width: 100%;
  height: 100%;
  display: flex;
  // padding: 20px;

  #echars2 {
    width: 50%;
    box-sizing: border-box;
    height: 100%;
    // padding: 20px;
  }
  #echars3 {
    width: 50%;
    box-sizing: border-box;
    height: 100%;
    // padding: 20px;
  }
}
</style>
