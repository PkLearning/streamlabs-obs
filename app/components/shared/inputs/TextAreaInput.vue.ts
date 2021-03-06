import { Component, Prop } from 'vue-property-decorator';
import { BaseInput } from './BaseInput';
import { IInputMetadata } from './index';

interface IWTextMetadata extends IInputMetadata {
  placeholder: string;
}

@Component({})
export default class TextAreaInput extends BaseInput<string, IWTextMetadata> {
  @Prop()
  readonly value: string;

  @Prop({ default: () => ({}) })
  readonly metadata: IWTextMetadata;

  handleInput(event: { target: HTMLInputElement }) {
    const val = event.target.value;
    const pos = event.target.selectionStart;
    if (val !== this.value) {
      this.$nextTick(() => (event.target.selectionEnd = pos));
    }
    this.emitInput(val);
  }
}
