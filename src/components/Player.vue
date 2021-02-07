<template>
  <div class="container">
    <div class="container" style="text-align: center">
      <b-button
        v-if="isPlaying"
        @click="stop"
      >
        停止
      </b-button>
      <b-button
        v-else
        @click="play"
      >
        播放
      </b-button>
    </div>
    <br />
    <div class="container">
      <FileSelector
        @files-selected="filesSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import FileSelector from '@/components/FileSelector.vue';

const endedEvent = 'ended';

Vue.use(Buefy);

@Component({
  components: {
    FileSelector,
  },
})
export default class Player extends Vue {
  private fileList: Array<File> = [];

  private player = new Audio();

  private isPlaying = false;

  constructor() {
    super();
    this.player.addEventListener(endedEvent, () => {
      this.play();
    });
  }

  public play() {
    if (this.fileList.length === 0) {
      this.$buefy.toast.open({
        message: '沒有檔案可播放',
        type: 'is-danger',
      });
      return;
    }
    const randomIdx = Math.floor(Math.random() * this.fileList.length);
    const selectedFile = this.fileList[randomIdx];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (loadedFile) => {
      if (!loadedFile.target) {
        this.$buefy.toast.open({
          message: '無法讀取檔案',
          type: 'is-danger',
        });
        return;
      }
      this.player.src = loadedFile.target.result as string;
      this.player.play();
      this.isPlaying = true;
    };
  }

  public stop() {
    this.player.pause();
    this.isPlaying = false;
  }

  private filesSelected(fileList: Array<File>) {
    this.fileList = fileList;
  }
}
</script>
