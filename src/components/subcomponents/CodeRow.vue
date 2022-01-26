<template>
  <div class="code-row">
    <div v-for="(piece, index) in code" :key="index" ref="code-piece" @click="onClick(index, attemptIndex)" class="code-piece">
      <div>{{ piece }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeRow',
  props: {
    code: Array,
    onClick: {
      required: true,
      type: Function
    },
    attemptIndex: Number,
  }
}
</script>

<style lang="scss">
$code-piece-margin: 0.4rem;
.code-row {
  display: flex;
  flex-wrap: nowrap;
  gap: $code-piece-margin;
  margin-bottom: $code-piece-margin;
  width: 100%;
  align-items: center;
  justify-content: center;

  .code-piece {
    display: flex;
    justify-content: center;
    border: 1px solid black;
    border-radius: 0.5rem;
    aspect-ratio: 1/1;
    cursor: pointer;
    width: 100%;

    > div {
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
  }

  &.active .code-piece {
    border-style: dashed;
  }
}
</style>
