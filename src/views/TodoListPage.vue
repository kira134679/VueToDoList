<script setup>
	import { ref, onMounted } from 'vue'
	import { useBaseUrlStore } from '@/stores/api'
	import { useTodosStore } from '@/stores/todos'
	import { storeToRefs } from 'pinia'
	import axios from 'axios'
	import { useRouter } from 'vue-router'

	const baseUrlStore = useBaseUrlStore();
	const { baseUrl } = storeToRefs(baseUrlStore);
	const router = useRouter();

	const todosStore = useTodosStore();
	const { todosAll } = storeToRefs(todosStore);
	const { getTodos } = todosStore;

	const todoToken = document.cookie.replace(
		/(?:(?:^|.*;\s*)todoToken\s*\=\s*([^;]*).*$)|^.*$/,
		"$1"
	)
	
	onMounted(async () => {
		if (todoToken === '') {
			router.push('/');
		}
		
		console.log(`token: ${todoToken}`)

		const res = await axios.get(`${baseUrl.value}/users/checkout`, {
			headers: {
				Authorization: todoToken
			}
		})

		userName.value = res.data.nickname;
		await getTodos();
	});

	const logOut = async () => {
		try {
			const res = await axios.post(`${baseUrl.value}/users/sign_out`, {}, {
				headers: {
					Authorization: todoToken
				}
			})


		} catch (error) {
			
		}

		router.push('/');
	}

	const userName = ref("");

	// const todosAll = ref(
	// 	[
	// 		{
	// 			id: 1,
	// 			isDone: false,
	// 			summary: "把冰箱發霉的檸檬拿去丟"
	// 		},
	// 		{
	// 			id: 2,
	// 			isDone: false,
	// 			summary: "打電話叫媽媽匯款給我"
	// 		},
	// 		{
	// 			id: 3,
	// 			isDone: false,
	// 			summary: "整理電腦資料夾"
	// 		},
	// 		{
	// 			id: 4,
	// 			isDone: false,
	// 			summary: "繳電費水費瓦斯費"
	// 		},
	// 		{
	// 			id: 5,
	// 			isDone: true,
	// 			summary: "約vicky禮拜三泡溫泉"
	// 		},
	// 		{
	// 			id: 6,
	// 			isDone: false,
	// 			summary: "約ada禮拜四吃晚餐"
	// 		}
	// 	]
	// );

	const todoToAdd = ref(
		{
			content: ""
		}
	);
	const addTodo = async () => {
		try {
			const res= await axios.post(
				`${baseUrl.value}/todos/`,
				todoToAdd.value,
				{
					headers: {
						Authorization: todoToken
					}
				}
			)
			
			console.log(res)
			todoToAdd.value.content = '';
			await getTodos();
		} catch (error) {
			console.log(error.response.data.message)
		}
	}
</script>

<template>
	<!-- ToDo List -->
	<div id="todoListPage" class="bg-half">
		<nav>
			<h1><a href="#">ONLINE TODO LIST</a></h1>
			<ul class="d-flex align-items-center">
				<li class="todo_sm"><a href="#/todolist"><span>{{ userName }}的代辦</span></a></li>
				<li><a class="btn btn-outline-danger" @click="logOut">登出</a></li>
			</ul>
		</nav>
		<div class="conatiner todoListPage vhContainer">
			<div class="todoList_Content">
				<div class="inputBox">
					<input type="text" placeholder="請輸入待辦事項" v-model="todoToAdd.content">
					<button class="btn btn-dark d-flex justify-content-center" :disabled="todoToAdd.content === ''">
						<!-- <i class="fa fa-plus"></i> -->
						<span class="material-symbols-outlined text-white" @click="addTodo">
							add_task
						</span>
					</button>
				</div>
				<div class="todoList_list">
					<ul class="todoList_tab">
						<li><a href="#" class="active">全部</a></li>
						<li><a href="#">待完成</a></li>
						<li><a href="#">已完成</a></li>
					</ul>
					<!-- <div class="todoList_items">
						<ul class="todoList_item">
							<li v-for="todo in todosAll" :key="todo.id">
								<label class="todoList_label">
									<input class="todoList_input" type="checkbox" v-model="todo.status">
									<span>{{ todo.content }}</span>
								</label>
								<a href="#">
									<span class="material-symbols-outlined">
										delete
									</span>
								</a>
							</li>
						</ul>
						<div class="todoList_statistics">
							<p> 5 個已完成項目</p>
						</div>
					</div> -->
					<div class="todoList_items">
						<ul class="todoList_item">
							<li v-for="todo in todosAll" :key="todo.id">
								<label class="todoList_label">
									<input class="todoList_input" type="checkbox" v-model="todo.status">
									<span>{{ todo.content }}</span>
								</label>
								<a href="#">
									<!-- <i class="fa fa-times"></i> -->
									<span class="material-symbols-outlined">
										delete
									</span>
								</a>
							</li>
						</ul>
						<div class="todoList_statistics">
							<p> 5 個已完成項目</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
