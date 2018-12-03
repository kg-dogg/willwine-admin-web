<template>
    <div class="app-container">
        <el-card>
            <div class="handle-box">
                <el-button class="el-icon-tickets" size="mini" type="primary" @click="addNode">创建分级目录</el-button>
            </div>

            <div>
                <VueTreeList @click="onClick" :indexChanged="indexChanged" :model="courses" default-tree-node-name="新层级" default-leaf-node-name="新课时" :leafNum=5></VueTreeList>
            </div>
            <div class="handle-box">
                <hr />
                <el-form label-width="120px">
                    <el-form-item label="每节课时时长">
                        <el-input style="width:10%" v-model="curriculum.duration"></el-input> 分钟
                    </el-form-item>
                </el-form>
            </div>

            <div>
                <el-button class="el-icon-tickets" type="primary" @click="save" :loading="loading"> 保存</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import TreeNode from '@/components/TreeList/TreeNode';
import Tree from '@/components/TreeList/Tree';
import VueTreeList from '@/components/TreeList/VueTreeList';

// import { VueTreeList, Tree, TreeNode } from '@/components/TreeList';
import { getCurriculumByID, setCourseLevel } from '@/api/api';

export default {
  components: {
    VueTreeList,
  },
  data() {
    return {
      cid: this.$route.params.id,
      treeStruct: {},
      courses: new Tree([]),
      curriculum: {},
      tree_max_id: 1000,
      loading: false,
      indexChanged: { flag: 0 },
    };
  },

  created() {
    this.getData();
  },

  watch: {
    indexChanged: {
      handler() {
        const newCourses = this.encodeCourse();
        if (newCourses) {
          newCourses.courses.forEach((item, index) => {
            this.changeIndex(this.courses.children, item.id, index + 1);
          });
        }
      },
      deep: true,
    },
  },


  // 方法集合
  methods: {
    changeIndex(children, id, index) {
      children.forEach((item) => {
        if (item.children) {
          this.changeIndex(item.children, id, index);
          return;
        }
        if (item.id === id) {
          item.index = index;
        }
      });
    },
    // 获取某个课程下所有课时数据
    getData() {
      this.loading = true;
      getCurriculumByID(this.cid, { include: 'course,classtype' })
        .then((res) => {
          this.curriculum = res.data;
          this.courses = new Tree(this.decodeCourse(res.data));
          this.indexChanged.flag += 1;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    onClick(model) {
      console.log(model);
    },

    // 创建根目录
    addNode() {
      const node = new TreeNode({
        name: '新层级',
        isLeaf: false,
        id: (this.tree_max_id += 1),
      });
      if (!this.courses.children) this.courses.children = [];
      this.courses.addChildren(node);
    },

    // 获取当前最新的数据结果 - JS
    getNewTree() {
      // const vm = this;
      const dfs = (oldNode) => {
        const newNode = {};
        Object.keys(oldNode).forEach((k) => {
          if (k !== 'children' && k !== 'parent') {
            newNode[k] = oldNode[k];
          }
        });
        if (oldNode.children && oldNode.children.length > 0) {
          newNode.children = [];
          for (let i = 0, len = oldNode.children.length; i < len; i += 1) {
            newNode.children.push(dfs(oldNode.children[i]));
          }
        }
        return newNode;
      };
      return dfs(this.courses);
      // console.log(this.courses)
    },

    // 解码后端数结构
    decodeCourse(bankendStruct) {
      const struct = [];
      let currId = 1;
      const addedSections = {};
      bankendStruct.course.data.forEach((item) => {
        if (!_.has(item, 'section') || item.section === null) {
          struct.unshift(this.genLeaf(item));
        } else {
          let section = struct.filter(val => val.secIndex === item.section)[0];
          if (!section) {
            section = this.initFolder((currId += 1), bankendStruct.sections[item.section], 0);
            section.secIndex = item.section;
            struct.unshift(section);
            addedSections[item.section] = [];
          }
          if (item.week || item.week === 0) {
            let week = section.children.filter(val => val.weekIndex === item.week)[0];
            if (!week) {
              week = this.initFolder((currId += 1), bankendStruct.weeks[item.section][item.week], section.id);
              week.weekIndex = item.week;
              section.children.unshift(week);
              addedSections[item.section].push(item.week);
            }
            week.children.unshift(this.genLeaf(item, week.id));
          } else {
            section.children.unshift(this.genLeaf(item, section.id));
          }
        }
      });
      // 空目录显示在当前目录最上方
      if (bankendStruct.sections) {
        const sections = [];
        bankendStruct.sections.forEach((item, index) => {
          const addedSection = Object.keys(addedSections);
          if (!addedSection.includes(index.toString())) {
            const section = this.initFolder((currId += 1), item, 0);
            sections.unshift(section);
            if (bankendStruct.weeks && bankendStruct.weeks[index]) {
              const sec = [];
              bankendStruct.weeks[index].forEach((week) => {
                const newWeek = this.initFolder((currId += 1), week, section.id);
                sec.unshift(newWeek);
              });
              section.children.push(...sec);
            }
          } else {
            const sec = [];
            let section = null;
            bankendStruct.weeks[index].forEach((week, weekIndex) => {
              if (!addedSections[index].includes(weekIndex)) {
                section = struct.filter(val => val.secIndex === index)[0];
                const newWeek = this.initFolder((currId += 1), week, section.id);
                sec.unshift(newWeek);
              }
            });
            if (section) section.children.push(...sec);
          }
        });
        struct.push(...sections);
      }
      return struct;
    },

    initFolder(id, name, pid) {
      const obj = {
        id,
        is_Leaf: false,
        name,
        pid,
        children: [],
      };
      return obj;
    },

    // 解码未后端数据结构
    encodeCourse() {
      const sections = [];
      const weeks = [];
      const sendCourse = [];
      let sectionIndex = 0;
      const data = this.getNewTree();
      if (!data.children) return undefined;
      data.children.forEach((v, k, arr) => {
        if (v.isLeaf) {
          // 无层级
          sendCourse.push({ id: v.id, title: v.name });
        } else {
          let weekIndex = 0;
          sections.push(v.name);
          if (_.has(v, 'children') && v.children.length > 0) {
            // 存在周或阶段
            const week = [];
            v.children.forEach((vv, kk, arrs) => {
              if (vv.isLeaf) {
                // 一级结构
                sendCourse.push({ id: vv.id, title: vv.name, section: sectionIndex });
              } else {
                week.push(vv.name);

                if (_.has(vv, 'children') && vv.children.length > 0) {
                  // 存在周
                  vv.children.forEach((vvv, kkk, arrc) => {
                    const courseItem = {
                      id: vvv.id,
                      title: vvv.name,
                      week: weekIndex,
                      section: sectionIndex,
                    };
                    sendCourse.push(courseItem);
                  });
                }
                weekIndex += 1;
              }
            });
            weeks.push(week);
          } else {
            weeks.push([]);
          }
          sectionIndex += 1;
        }
      });

      const rtn = { courses: sendCourse };
      if (sections.length > 0) {
        rtn.sections = sections;
      }
      if (weeks.length > 0) {
        rtn.weeks = weeks;
      }

      return rtn;
    },

    genLeaf(data, pid = 0) {
      return { id: data.id, isLeaf: true, name: data.title, pid, index: data.index };
    },

    // 保存数据
    save() {
      this.loading = true;
      if (this.curriculum.duration === '' || this.curriculum.duration <= 1) {
        this.$message({ message: '请输入正确的课时时长', type: 'error' });
        this.loading = false;
        return;
      }
      const params = this.encodeCourse() ? this.encodeCourse() : { courses: [] };
      params.duration = this.curriculum.duration;
      setCourseLevel(this.cid, params)
        .then((res) => {
          this.$alert('课时目录保存成功!', '成功', {
            confirmButtonText: '确定',
            callback: (action) => {
              this.getData();
            },
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>


<style scoped>
</style>

