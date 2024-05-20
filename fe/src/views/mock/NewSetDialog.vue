<template>
  <el-dialog title="新建场景" :visible.sync="visible" width="30%">
    <div>
      场景名称：<el-input
        v-model="input"
        placeholder="请输入场景名称"
      ></el-input>
    </div>
    <div class="rule-wrapper">
      <div>规则：</div>
      <div v-for="(item, index) of checkedRule" :key="index">
        {{ item.url }}-{{ item.label }}
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'NewSetDialog',
  props: ['visible'],
  data() {
    return {
      input: '',
      checkedRule: [
        {
          url: 'url',
          label: 'label'
        },
        {
          url: 'url',
          label: 'label'
        }
      ]
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async confirm() {
      const { $req, $awaitTo } = this;
      const req = $req({
        url: '/$set-create',
        method: 'post',
        data: {
          name: this.input,
          rules: this.checkedRule
        }
      });

      const { err } = await $awaitTo(req);
      if (err) {
        return;
      }
      this.$message.success('success');
      this.close();
      // TODO 切换到场景tab
    }
  }
};
</script>
<style lang="scss">
.rule-wrapper {
  margin-top: 20px;
}
</style>
