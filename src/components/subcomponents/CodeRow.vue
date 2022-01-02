<template>
  <div class="code-row">
    <div v-for="(piece, index) in code" :key="index" ref="code-piece" @click="onClick(index)" class="code-piece">
      <p>{{ piece }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CodeRow',
  props: {
    code: Array,
    onClick: Function,
  }
}
</script>

<style scoped lang="scss">
div {
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  width: 100%;
  align-items: center;
  justify-content: center;

  .code-piece {
    border: 1px solid black;
    border-radius: 0.5rem;
    aspect-ratio: 1/1;
    cursor: pointer;

    p {
      text-align: center;
    }
  }
}
</style>
