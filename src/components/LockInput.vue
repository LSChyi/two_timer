<template>
  <b-field :label="label">
    <template v-if="editing">
      <b-input
        v-model.number="value"
        type="number"
        min="0"
        @blur="commitValue"
        required
      ></b-input>
    </template>
    <template v-else>
      <b-input
        v-model="value"
        disabled
      ></b-input>
    </template>
  </b-field>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Buefy);

@Component
export default class LockInput extends Vue {
  @Prop({ default: true, required: true }) readonly editing: boolean;

  @Prop(String) readonly label: string;

  @Prop(Number) readonly initialValue: number;

  private value: number;

  constructor() {
    super();
    this.value = this.initialValue;
  }

  commitValue() {
    this.$emit('commit', this.value);
  }
}
</script>
