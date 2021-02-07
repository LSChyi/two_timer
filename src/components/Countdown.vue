<template>
  <div class="container tile is-ancestor">
    <div class="tile is-6 is-parent">
      <div class="tile is-child box">
        <h2 class="title">{{ countdownTypeStatus }} {{ countdownStatus }}</h2>
        <h2 class="title" style="text-align: center;">{{ tickRemain }}</h2>
     </div>
    </div>
    <div class="tile is-6 is-vertical is-parent">
      <div class="tile is-child box">
        <LockInput
          :editing="!isRunning"
          :initialValue="readingTime"
          @commit="updateReadingTime"
          label="讀書時間 (分鐘)"
        ></LockInput>
        <LockInput
          :editing="!isRunning"
          :initialValue="restTime"
          @commit="updateRestTime"
          label="休息時間 (分鐘)"
        ></LockInput>
        <template v-if="!isRunning">
          <b-button
            type="is-primary"
            @click="run"
            expanded
          >
            開始計時
          </b-button>
        </template>
        <template v-else>
          <b-button
            type="is-primary is-light"
            @click="stop"
            expanded
          >
            停止計時
          </b-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import { Timer, convertMinutesToTimerUnit } from '@/lib/timer';
import LockInput from '@/components/LockInput.vue';

const readingTimeKey = 'readingTime';
const restTimeKey = 'restTime';

enum CountdownStatus {
  Running = '倒數中',
  Stop = '暫停中',
}

enum CountdownType {
  Reading = '讀書',
  Rest = '休息',
}

function getNumberFromLocalStorage(key: string): number {
  const value = window.localStorage.getItem(key);
  return Number(value);
}

function setNumberInLocalStorage(key: string, value: number): void {
  window.localStorage.setItem(key, value.toString());
}

Vue.use(Buefy);

@Component({
  components: {
    LockInput,
  },
})
export default class Countdown extends Vue {
  private countdownStatus = CountdownStatus.Stop;

  private countdownTypeStatus = CountdownType.Reading;

  private readingTime: number;

  private restTime: number;

  private timer: Timer;

  private remain = 0;

  constructor() {
    super();
    this.readingTime = getNumberFromLocalStorage(readingTimeKey);
    this.restTime = getNumberFromLocalStorage(restTimeKey);
    this.setupTimer(this.readingTime);
  }

  get isRunning(): boolean {
    return this.countdownStatus === CountdownStatus.Running;
  }

  get tickRemain(): string {
    return `${Math.floor(this.remain / 60)} : ${(this.remain % 60)}`;
  }

  private setupTimer(minute: number) {
    if (this.timer) {
      this.timer.clear();
    }
    this.timer = new Timer(convertMinutesToTimerUnit(minute), (remain) => {
      this.remain = remain;
    });
    this.remain = 0;
    this.countdownStatus = CountdownStatus.Stop;
  }

  private updateReadingTime(value: number) {
    if (this.readingTime === value) {
      return;
    }
    this.readingTime = value;
    setNumberInLocalStorage(readingTimeKey, this.readingTime);
    this.setupTimer(this.readingTime);
  }

  private updateRestTime(value: number) {
    if (this.restTime === value) {
      return;
    }
    this.restTime = value;
    setNumberInLocalStorage(restTimeKey, this.restTime);
    this.setupTimer(this.readingTime);
  }

  private run() {
    this.timer.start(this.timerEndCallback);
    this.countdownStatus = CountdownStatus.Running;
  }

  private stop() {
    this.timer.pause();
    this.countdownStatus = CountdownStatus.Stop;
  }

  private timerEndCallback() {
    if (this.countdownTypeStatus === CountdownType.Reading) {
      this.countdownTypeStatus = CountdownType.Rest;
      this.setupTimer(this.restTime);
      this.$emit('rest');
    } else {
      this.countdownTypeStatus = CountdownType.Reading;
      this.setupTimer(this.readingTime);
      this.$emit('reading');
    }

    this.run();
  }
}
</script>
