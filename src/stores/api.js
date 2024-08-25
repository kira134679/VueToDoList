import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBaseUrlStore = defineStore(
	'api', () => {
		const baseUrl = ref("https://todolist-api.hexschool.io");
		return { baseUrl }
	}
);