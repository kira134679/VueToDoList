import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useTodosStore = defineStore(
	'todosAll', () => {
		const todosAll = ref(
			[
				{
					id: 1,
					isDone: false,
					summary: "把冰箱發霉的檸檬拿去丟"
				},
				{
					id: 2,
					isDone: false,
					summary: "打電話叫媽媽匯款給我"
				},
				{
					id: 3,
					isDone: false,
					summary: "整理電腦資料夾"
				},
				{
					id: 4,
					isDone: false,
					summary: "繳電費水費瓦斯費"
				},
				{
					id: 5,
					isDone: true,
					summary: "約vicky禮拜三泡溫泉"
				},
				{
					id: 6,
					isDone: false,
					summary: "約ada禮拜四吃晚餐"
				}
			]
		);

		return { todosAll }
	}
);
