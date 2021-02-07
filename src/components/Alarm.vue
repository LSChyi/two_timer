<template>
  <div class="container box">
    <section>
      <b-field label="鬧鐘狀態">
        <b-switch
          size="is-large"
          v-model="active"
          @input="alarmSwitchChanged"
        >{{ getAlarmStatusText }}</b-switch>
      </b-field>
    </section>
    <section>
      <b-field label="設定時刻">
        <b-clockpicker
          v-model="alarmTime"
          placeholder="點選進行設定"
          icon="clock"
          @input="setAlarmTime"
          hour-format="12">
        </b-clockpicker>
      </b-field>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import { Timer } from '@/lib/timer';

const alarmKey = 'alarm';

function getDateFromLocalStorage(key: string): Date {
  const value = window.localStorage.getItem(key);
  if (value) {
    return new Date(value);
  }
  return new Date();
}

function setDateFromLocalStorage(key: string, value: Date) {
  window.localStorage.setItem(key, value.toString());
}

Vue.use(Buefy);

@Component
export default class Alarm extends Vue {
  private active = false;

  private alarmTime: Date;

  private timer: Timer;

  constructor() {
    super();
    this.timer = new Timer(0, () => ({}));
    this.alarmTime = getDateFromLocalStorage(alarmKey);
  }

  get getAlarmStatusText(): string {
    return this.active ? '已啟用' : '已關閉';
  }

  private alarmSwitchChanged() {
    this.timer.clear();
    if (!this.active) {
      return;
    }

    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(
      this.alarmTime.getHours(),
      this.alarmTime.getMinutes(),
      0,
      0,
    );

    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
      this.$buefy.toast.open({
        message: `鬧鐘將於明天 ${this.alarmTime.getHours()}:${this.alarmTime.getMinutes()} 響起`,
        type: 'is-success',
      });
    } else {
      this.$buefy.toast.open({
        message: `鬧鐘將於今天 ${this.alarmTime.getHours()}:${this.alarmTime.getMinutes()} 響起`,
        type: 'is-success',
      });
    }
    const timeDiff = targetTime.getTime() - now.getTime();
    this.timer = new Timer(timeDiff, () => ({}));
    this.timer.start(() => {
      this.$emit('alarm');
      this.$buefy.dialog.alert({
        title: '鬧鐘',
        message: '鬧鐘響起',
        confirmText: '關閉鬧鐘',
        onConfirm: () => {
          this.$emit('stop');
        },
      });
    });
  }

  private setAlarmTime() {
    setDateFromLocalStorage(alarmKey, this.alarmTime);
    this.alarmSwitchChanged();
  }
}
</script>
