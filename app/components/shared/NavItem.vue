<template>
<li
  class="nav-item"
  :class="{ active: to === value, disabled: enabled === false, 'nav-item--child': isSubItem }"
  @click="onClickHandler"
>
  <i v-if="ico" :class="ico" @click="onIconClickHandler"></i>
  <div class="nav-item__content">
    <slot></slot>
    <div v-if="expanded" class="nav-item__children">
      <slot name='children'></slot>
    </div>
  </div>
  <i v-if="expandable" :class="expanded ? 'icon-subtract' : 'icon-add'" />
</li>
</template>

<script lang="ts" src="./NavItem.vue.ts"></script>

<style lang="less" scoped>
@import "../../styles/index";

.nav-item {
  cursor: pointer;
  list-style: none;
  border-left: 1px solid transparent;
  padding-left: 46px;
  font-size: 14px;
  .margin-bottom();
  .text-transform();
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  &.nav-item--child {
    padding-left: 0;
    border-left: 0;
  }

  &.active {
    opacity: 1;
    .weight(@medium);
    border-color: @navy;
    color: @day-title;

    .fa,
    i {
      color: @day-title;
    }
  }

  &:hover {
    opacity: 1;
  }

  &.disabled {
    opacity: 0.3;
    cursor: default;
  }

  .fa,
  i {
    color: @icon;
    position: relative;
    margin-right: -16px;
    left: -24px;
    width: 16px;
    padding: 3px 0;
  }
}

.nav-item__content {
  overflow: hidden;
  // max-width: calc(~"100% - 20px");
  width: 100%;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-item__children {
  .margin-top();
}

.night-theme {
  .nav-item {
    &.active {
      border-color: @white;
      color: @white;

      .fa,
      i {
        color: @white;
      }
    }
  }
}

</style>
