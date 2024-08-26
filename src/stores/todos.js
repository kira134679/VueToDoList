import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useBaseUrlStore } from '@/stores/api'
import axios from 'axios';


export const useTodosStore = defineStore(
	'todosAll', () => {
		// const todosAll = ref(
		// 	[
		// 		{
		// 			id: 1,
		// 			createTime: 0,
		// 			content: "把冰箱發霉的檸檬拿去丟",
		// 			status: false
		// 		},
		// 		{
		// 			id: 2,
		// 			createTime: 0,
		// 			content: "打電話叫媽媽匯款給我",
		// 			status: false
		// 		},
		// 		{
		// 			id: 3,
		// 			createTime: 0,
		// 			content: "整理電腦資料夾",
		// 			status: false
		// 		},
		// 		{
		// 			id: 4,
		// 			createTime: 0,
		// 			content: "繳電費水費瓦斯費",
		// 			status: false
		// 		},
		// 		{
		// 			id: 5,
		// 			createTime: 0,
		// 			content: "約vicky禮拜三泡溫泉",
		// 			status: true
		// 		},
		// 		{
		// 			id: 6,
		// 			createTime: 0,
		// 			content: "約ada禮拜四吃晚餐",
		// 			status: false
		// 		}
		// 	]
		// );

		const baseUrlStore = useBaseUrlStore();
		const { baseUrl } = storeToRefs(baseUrlStore);

		const todosAll = ref([]);

		async function getTodos() {
			try {
				const todoToken = document.cookie.replace(
					/(?:(?:^|.*;\s*)todoToken\s*\=\s*([^;]*).*$)|^.*$/,
					"$1"
				)

				const res = await axios.get(`${baseUrl.value}/todos/`, {
					headers: {
						Authorization: todoToken
					}
				});
				console.log(res)
				todosAll.value = [...res.data.data];
			} catch (error) {
				console.log(error);
			}
		}

		return { todosAll, getTodos }
	}
);
