<template>
  <section class="container">
    <div class="section">
      <b-tabs size="is-large" v-model="activeTab">
        <b-tab-item label="循環計時">
          <Countdown
            @rest="rest"
            @reading="reading"
          />
        </b-tab-item>
        <b-tab-item label="定時鬧鐘">
          <Alarm
            @alarm="alarm"
            @stop="stop"
          />
        </b-tab-item>
      </b-tabs>
    </div>
    <div class="container box">
      <b-field label="是否播放音樂時也鎖定螢幕">
        <b-switch
          size="is-large"
          v-model="activeLockScreen"
          @input="lockScreenSwitchChanged"
        >{{ getLockScreenStatusText }}</b-switch>
      </b-field>
    </div>
    <hr class="hr">
    <div class="section">
      <Player
        ref="player"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import Countdown from '@/components/Countdown.vue';
import Alarm from '@/components/Alarm.vue';
import Player from '@/components/Player.vue';

const lockScreenKey = 'lock_screen';

function getBoolFromLocalStorage(key: string): boolean {
  const value = window.localStorage.getItem(key);
  if (value) {
    return value === 'true';
  }
  return false;
}

function setBoolFromLocalStorage(key: string, value: boolean) {
  window.localStorage.setItem(key, value.toString());
}

Vue.use(Buefy);

@Component({
  components: {
    Countdown,
    Alarm,
    Player,
  },
})
export default class App extends Vue {
  private activeLockScreen = false;

  constructor() {
    super();
    this.activeLockScreen = getBoolFromLocalStorage(lockScreenKey);
  }

  $refs!: {
    player: HTMLFormElement;
  }

  private activeTab = 0;

  get getLockScreenStatusText(): string {
    return this.activeLockScreen ? '已啟用播放音樂時鎖定螢幕' : '不鎖定';
  }

  private lockScreenSwitchChanged() {
    setBoolFromLocalStorage(lockScreenKey, this.activeLockScreen);
  }

  private rest() {
    if (this.activeLockScreen) {
      fetch('/close');
    }
    this.$refs.player.play();
  }

  private reading() {
    this.$refs.player.stop();
  }

  private alarm() {
    this.$refs.player.play();
  }

  private stop() {
    this.$refs.player.stop();
  }
}
</script>
