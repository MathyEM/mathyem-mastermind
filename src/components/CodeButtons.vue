<template>
  <div class="code-buttons">
    <!-- if the solution is set and they have codebreaker authority -->
    <CodeRow v-if="getSolutionState" ref="code-buttons" :code="getCodeSet" :onClick="onClick" :disabled="!hasCodeBreakerAuthority || getReviewingPreviousRound" class="code-buttons-code-row" />
    <!-- if the solution is set do you have codemaker authority -->
    <CodeRow v-else ref="code-buttons" :code="getCodeSet" :onClick="onClick" :disabled="!hasCodeMakerAuthority || getReviewingPreviousRound" class="code-buttons-code-row" />
  </div>
</template>

<script>
import CodeRow from '@/components/subcomponents/CodeRow.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CodeButtons',
  components: {
    CodeRow,
  },
  props: {
  },
  computed: {
    ...mapGetters(['getCodeSet', 'getSolutionState', 'hasCodeBreakerAuthority', 'hasCodeMakerAuthority', 'getReviewingPreviousRound']),
  },
  methods: {
    ...mapActions(['updateAttempt', 'updateLocalSolution']),
    onClick(index) {
      if (this.getSolutionState) {
        this.updateAttempt(index)
        return
      }
      this.updateLocalSolution(index)
    }
  }
}
</script>

<style lang="scss">
.code-buttons-code-row {
  gap: 0;

  .code-piece {
    margin: 0 calc($code-piece-margin / 2);
    color: $text-color;
    background: $background-color-8dp;
    box-shadow: $shadow-8dp;
    border-color: none;
    &:active {
      background: $background-color-2dp;
      box-shadow: $shadow-2dp;
      border-color: none;
      transition: background-color 50ms ease-in-out, box-shadow 50ms ease-in-out;
    }

    > div {
      @include code-piece-scaling(1.3)
    }
  }
}
.is-browser {
  .code-buttons-code-row .code-piece > div {
    @include code-piece-scaling(1.25)
  }
}

@media screen and (max-width: 375px) {
  .is-browser .code-buttons-code-row {
    .code-piece {
      > div {
        @include code-piece-scaling(1.25)
      }
    }
  }
}
</style>
