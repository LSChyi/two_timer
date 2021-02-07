<template>
  <div class="container">
    <div class="container" style="text-align: center">
      <b-upload
        class="file-label"
        accept="audio/*"
        multiple
        @input="selectFiles"
      >
        <span class="file-cta">
          <b-icon class="file-icon" icon="upload"></b-icon>
            <span class="file-label">選擇檔案</span>
        </span>
      </b-upload>
    </div>
    <div class="container">
      <b-field label="播放清單">
        <template v-if="fileList.length !== 0">
          <ol>
            <li
              v-for="(file, idx) in fileList"
              :key="idx">
              <input
                type="button"
                value="刪除"
                @click="deleteFile(idx)"
              />
              {{ file.name }}
            </li>
          </ol>
        </template>
        <template v-else>
          無檔案
        </template>
      </b-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Buefy);

@Component
export default class FileSelector extends Vue {
  private fileList: Array<File> = [];

  public selectFiles(fileList: Array<File>) {
    this.fileList = fileList;
    this.$emit('files-selected', this.fileList);
  }

  public deleteFile(index: number) {
    this.fileList.splice(index, 1);
  }
}
</script>
