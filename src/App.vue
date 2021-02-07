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

Vue.use(Buefy);

@Component({
  components: {
    Countdown,
    Alarm,
    Player,
  },
})
export default class App extends Vue {
  $refs!: {
    player: HTMLFormElement;
  }

  private activeTab = 0;

  private rest() {
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
