import { Component, Prop, Watch } from 'vue-property-decorator';
import ChatbotWindowsBase from 'components/page-components/Chatbot/windows/ChatbotWindowsBase.vue';
import { $t } from 'services/i18n';
import * as _ from 'lodash';
import {
  IChatbotErrorResponse,
  IBettingProfile,
  IBettingOption
} from 'services/chatbot';
import { EInputType } from 'components/shared/inputs/index';
import ValidatedForm from 'components/shared/inputs/ValidatedForm.vue';
import { ITab } from 'components/Tabs.vue';
import { cloneDeep } from 'lodash';
import { debounce } from 'lodash-decorators';
import ChatbotBetOptionModal from '../Bet/ChatbotBetOptionModal.vue';

@Component({
  components: {
    ValidatedForm,
    ChatbotBetOptionModal
  }
})
export default class ChatbotBettingProfileWindow extends ChatbotWindowsBase {
  $refs: {
    form: ValidatedForm;
  };

  newProfile: IBettingProfile = {
    id: null,
    options: [],
    timer: {
      enabled: false,
      duration: 300
    },
    loyalty: {
      min: 10,
      max: 10000
    },
    title: '',
    send_notification: false
  };

  tabs: ITab[] = [
    {
      name: $t('General'),
      value: 'general'
    },
    {
      name: $t('Advanced'),
      value: 'advanced'
    }
  ];

  get metaData() {
    return {
      title: {
        required: true,
        type: EInputType.text,
        max: 100,
        placeholder: $t('Title'),
        uuid: $t('Title')
      },
      duration: {
        required: true,
        type: EInputType.number,
        min: 1,
        max: 86400,
        placeholder: $t('Duration'),
        uuid: $t('Duration')
      },
      min: {
        required: true,
        type: EInputType.number,
        min: 10,
        max: 100000,
        placeholder: $t('Minimum'),
        tooltip: $t('Minimum amount of points that is required to be bet'),
        uuid: $t('Minimum')
      },
      max: {
        required: true,
        type: EInputType.number,
        min: 10,
        max: 100000,
        placeholder: $t('Maximum'),
        tooltip: $t('Maximum amount of points that is allowed to be bet'),
        uuid: $t('Maximum')
        
      }
    };
  }

  selectedOption: IBettingOption = {
    name: null,
    parameter: null
  };

  selectedIndex: number = -1;

  selectedTab: string = 'general';

  mounted() {
    // if editing existing custom command
    if (this.isEdit) {
      this.newProfile = cloneDeep(this.profileToUpdate);
    }
  }

  get isEdit() {
    return this.profileToUpdate && this.profileToUpdate.id;
  }

  get profileToUpdate() {
    return this.chatbotApiService.Common.state.bettingProfileToUpdate;
  }

  get baseCommand() {
    return (
      this.chatbotApiService.Betting.state.bettingPreferencesResponse.settings
        .commands['bet'].command + ' '
    );
  }

  get NEW_BET_OPTION_MODAL_ID() {
    return 'new-betting-option';
  }

  @Watch('errors.items.length')
  @debounce(200)
  async onErrorsChanged() {
    await this.$refs.form.validateAndGetErrorsCount();
  }

  onSelectTabHandler(tab: string) {
    this.selectedTab = tab;
  }

  async onSaveHandler() {
    if (await this.$refs.form.validateAndGetErrorsCount()) return;

    if (this.newProfile.id) {
      await this.chatbotApiService.Betting.updateProfile(this.newProfile).catch(
        this.onErrorHandler
      );
    } else {
      await this.chatbotApiService.Betting.addProfile(this.newProfile).catch(
        this.onErrorHandler
      );
    }
  }

  onErrorHandler(errorResponse: IChatbotErrorResponse) {
    if (errorResponse.error && errorResponse.error === 'Duplicate') {
      alert($t('This name is already taken. Try another name.'));
    }
  }

  onAddOptionHandler(option: IBettingOption, index: number) {
    if (!option) {
      this.selectedOption = {
        name: null,
        parameter: null
      };
    } else {
      this.selectedOption = option;
    }

    this.selectedIndex = index;
    this.$modal.show(this.NEW_BET_OPTION_MODAL_ID);
  }

  onAddedHandler(option: IBettingOption = null, index: number = -1) {
    const dupe = _.find(this.newProfile.options, x => {
      return (
        x.name.toLowerCase() == option.name.toLowerCase() ||
        x.parameter.toLowerCase() == option.parameter.toLowerCase()
      );
    });

    if (!dupe) {
      if (index === -1) {
        this.newProfile.options.push(option);
      } else {
        this.newProfile.options.splice(index, 1, option);
      }
    }
  }

  onRemoveOptionHandler(index: number) {
    this.newProfile.options.splice(index, 1);
  }
}
