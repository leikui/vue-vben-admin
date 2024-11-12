<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Button, Card, message,Tag,Tooltip,Space,Input } from 'ant-design-vue';
import {DeleteOutlined,PlusOutlined} from '@ant-design/icons-vue';
import { useVbenForm } from '#/adapter/form';
import { nextTick, reactive, ref } from 'vue';

const props = defineProps({
  state: {
    type: Object,
    required: true
  }
});
// 定义发射事件，用于向父组件传递更新后的数据
const emit = defineEmits(['update:state']);

const inputRef = ref();
//动态添加
const detail = JSON.parse(JSON.stringify(props.state.detail));

const showInput = () => {
  props.state.inputVisible = true;
  props.state.inputValue = '1';
  nextTick(() => {
    console.log(props.state);
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

const handleClose = (removedTag: string) => {
  const tags = props.state.detail.filter(tag => tag !== removedTag);
  console.log(tags);
  // 发射事件通知父组件更新tags数据
  emit('update:state', JSON.stringify(tags));
};
const handleInputConfirm = () => {
  const inputValue = props.state.inputValue;
  let tags = props.state.detail;
  if (inputValue && tags.indexOf(inputValue) === -1) {
    tags = [...tags, inputValue];
  }
  // 发射事件通知父组件更新完整的state数据
  emit('update:state', JSON.stringify(tags));
};
</script>

<template>
  <div>
        <div class="">
          {{state}}
          <div >
            <Space>
            <span>{{ state.value }}:</span>
            <span><DeleteOutlined /></span>
          </Space>
            <div class="mt-2">
              <template v-for="(tag, index) in state.detail" :key="index">
                <Tooltip v-if="tag.length > 20" :title="tag">
                  <Tag closable @close="handleClose(tag)">
                    {{ `${tag.slice(0, 20)}...` }}
                  </Tag>
                </Tooltip>
                <Tag v-else closable @close="handleClose(tag)">
                  {{ tag }}
                </Tag>
              </template>
              <Space>
                <Input
                  v-if="state.inputVisible"
                  ref="inputRef"
                  v-model:value="state.inputValue"
                  type="text"
                  :style="{ width: '120px' }"
                  @blur="handleInputConfirm"
                  @keyup.enter="handleInputConfirm"
                />
                <Tag
                  v-else
                  style="background: #fff; border-style: dashed"
                  @click="showInput"
                >
                  <plus-outlined />
                  添加
                </Tag>
              </Space>
            </div>
          </div>
        </div>
      </div>
</template>
