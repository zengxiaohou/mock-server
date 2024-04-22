<template>
  <div class="page-mock">
    <div v-if="!isEmpty">
      <el-input
        class="search"
        placeholder="url to search"
        prefix-icon="el-icon-search"
        v-model="search"
      >
      </el-input>
      <el-collapse v-if="isMockEmpty">
        <el-collapse-item
          v-for="(businessCgis, businessKey) in matchMocks"
          :key="businessKey"
        >
          <template slot="title">
            <div>{{ businessKey }}</div>
          </template>
          <el-collapse-item
            v-for="(cgis, cgiKey) in businessCgis"
            :key="cgiKey"
          >
            <template slot="title">
              <el-checkbox
                @click.stop
                class="title-check"
                :value="isTitleChecked(businessKey, cgiKey)"
                :disabled="isTitleCheckDisable(businessKey, cgiKey)"
                @change="bindTitleCheck(businessKey, cgiKey)"
              ></el-checkbox>
              <mk-highlight :str="search" class="title">{{
                cgiKey
              }}</mk-highlight>
              <el-button
                @click.stop="bindVerify($event, businessKey, cgiKey)"
                size="mini"
                class="btn"
                >verify</el-button
              >
              <copy-btn
                :content="cgiKey"
                size="mini"
                class="btn last"
                @click.native.stop
                @success="$message.success('copy url: ' + cgiKey)"
                @error="$message.error('error occurred')"
                type="primary"
                >copy</copy-btn
              >
            </template>
            <div v-for="(mock, i) in cgis" :key="mock.label">
              <el-checkbox
                :value="
                  mockChecked[businessKey] &&
                    mockChecked[businessKey][cgiKey] === i
                "
                @change="bindCheckItem(businessKey, cgiKey, i)"
                >{{ mock.label }}</el-checkbox
              >
            </div>
          </el-collapse-item>
        </el-collapse-item>
      </el-collapse>
      <div v-else class="tips">no api match `{{ this.search }}`</div>
    </div>
    <div v-if="isEmpty" class="tips">
      No data yet, want
      <el-button type="text" @click="bindGenerate"
        >generate with template</el-button
      >?
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Page-Mock',
  data() {
    const base = `${window.location.protocol}//${window.location.host}`;
    return {
      search: '',
      base
    };
  },
  computed: {
    ...mapState(['mocks', 'mockChecked']),
    isEmpty() {
      return _.isEmpty(this.mocks.data);
    },
    isMockEmpty() {
      return Object.keys(this.matchMocks).length !== 0;
    },
    matchMocks() {
      if (!this.search || this.search.length === 0) {
        return this.mocks.data;
      }
      let mocks = {};
      Object.keys(this.mocks.data).forEach(k => {
        if (k.includes(this.search)) {
          mocks[k] = this.mocks.data[k];
        }
      });
      return mocks;
    }
  },
  methods: {
    async bindGenerate() {
      const { $req, $awaitTo } = this;

      const req = $req({
        url: '/$create'
      });

      const { err } = await $awaitTo(req);
      if (err) {
        return;
      }
      this.$message.success('success');
    },
    async reqestMockCheck(businessKey, cgiKey, index) {
      const { $req, $awaitTo } = this;

      const req = $req({
        url: '/$mock-check',
        data: { businessKey, id: cgiKey, index }
      });

      await $awaitTo(req);
    },
    bindCheckItem(businessKey, cgiKey, index) {
      if (this.mockChecked && this.mockChecked[businessKey]) {
        switch (this.mockChecked[businessKey][cgiKey]) {
          case undefined:
            break;
          case index:
            index = -1;
            break;
        }
      }
      this.$store.commit('mockChecked', { cgiKey, index });
      this.reqestMockCheck(businessKey, cgiKey, index);
    },
    bindVerify(e, businessKey, key) {
      const url = `${
        this.base
      }/$mock-api?businessKey=${businessKey}&api=${key}`;
      window.open(url, '_blank');
    },
    isTitleCheckDisable(businessKey, cgiKey) {
      const apiMocks = this.mocks.data[businessKey][cgiKey];
      const checked =
        this.mockChecked &&
        this.mockChecked[businessKey] &&
        this.mockChecked[businessKey][cgiKey];

      if (apiMocks.length === 1) {
        return false;
      }

      if (checked !== -1 && (checked || checked === 0)) {
        return false;
      }

      return true;
    },
    isTitleChecked(businessKey, cgiKey) {
      console.log(
        'xixi this.mockChecked',
        this.mockChecked,
        businessKey,
        cgiKey
      );
      const checked =
        this.mockChecked &&
        this.mockChecked[businessKey] &&
        this.mockChecked[businessKey][cgiKey];

      if (checked !== -1 && (checked || checked === 0)) {
        return true;
      }

      return false;
    },
    bindTitleCheck(businessKey, cgiKey) {
      const apiMocks = this.mocks[businessKey][cgiKey];
      const checked =
        this.mockChecked &&
        this.mockChecked[businessKey] &&
        this.mockChecked[businessKey][cgiKey];

      if (apiMocks.length === 1) {
        return this.bindCheckItem(cgiKey, 0);
      }

      // 已勾选
      if (checked !== -1 && (checked || checked === 0)) {
        this.bindCheckItem(cgiKey, checked);
      }
    }
  }
};
</script>

<style lang="scss">
.page-mock {
  .search {
    margin-bottom: 10px;
  }
  .el-collapse-item__header {
    font-size: 18px;
    line-height: 1.2;
    padding-left: 10px;
  }

  .el-collapse-item__content {
    padding-left: 30px;

    .el-checkbox__label {
      font-size: 16px;
      &:hover {
        color: $main;
      }
    }
  }

  .title-check {
    margin-right: 10px;
    margin-top: 4px;
  }

  .tips {
    font-size: 20px;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 1px solid $white;
    .el-button {
      font-size: 20px;
      font-weight: 400;
    }
  }
  .title {
    flex: 1;
  }
  .btn {
    padding: 5px 8px;
    margin-right: 10px;

    &.last {
      margin-left: 0;
    }
  }
}
</style>
