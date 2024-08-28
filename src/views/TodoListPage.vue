<script setup>
	import { ref, onMounted, computed } from 'vue'
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
		getTodos();
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
			getTodos();
		} catch (error) {
			console.log(error.response.data.message)
		}
	}

	const textToUpdate = ref(
		{
			content: ""
		}
	);

	const editTodo = (todoId) => {
		console.log(`edit: ${todoId}`)

		todosAll.value.forEach(todo => delete todo.isEdit);

		todosAll.value.filter(todo => {
			if (todo.id === todoId) {
				todo.isEdit = true;
				textToUpdate.value.content = todo.content;
			}
		})
	}

	const updateTodo = async (todo) => {
		if (textToUpdate.value.content === todo.content) {
			console.log("變更後的內容與變更前相同，不做任何事");
			cancelTodoChange();
			return
		}

		try {
			const res = await axios.put(
				`${baseUrl.value}/todos/${todo.id}`,
				textToUpdate.value,
				{
					headers: {
						Authorization: todoToken
					}
				}
			)

			todo.content = textToUpdate.value.content; 
			delete todo.isEdit;
		} catch (error) {
			console.log(error)

			updateFailedMsg.value = [error.response.data.message].flat();
			
			new bootstrap.Modal(document.getElementById('loginErrorModal')).show();
		}
	}

	const updateFailedMsg = ref("");

	const cancelTodoChange = () => {
		todosAll.value.forEach(todo => delete todo.isEdit);
	}

	const removeTodo = async (todoId) => {
		console.log('delete: ' + todoId);

		try {
			const res = await axios.delete(`${baseUrl.value}/todos/${todoId}`, {
				headers: {
					Authorization: todoToken
				}
			})

			console.log(res)

			getTodos();
		} catch (error) {
			console.log(error)
		}
	}

	const toggleTodo = async (todoId) => {
		try {
			const res = await axios.patch(`${baseUrl.value}/todos/${todoId}/toggle`,{}, {
				headers: {
					Authorization: todoToken
				}
			})

			console.log(res)

			getTodos();
		} catch (error) {
			console.log(error)
		}
	}

	const todosDoneCount = computed(() => {
		return todosAll.value.filter(todo => todo.status === true).length
	})
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
					<div class="todoList_items">
						<ul class="list-group list-group-flush">
							<div class="text-center m-2" v-if="todosAll.length === 0">目前尚無待辦事項</div>
							<li class="list-group-item" v-for="todo in todosAll" :key="todo.id">
								<a id="saveBtn" v-if="todo.isEdit" @click="updateTodo(todo)">
									<span class="material-symbols-outlined">check</span>
								</a>
								<a id="editBtn" @click="editTodo(todo.id)" v-if="!todo.isEdit">
									<span class="material-symbols-outlined">edit</span>
								</a>
								<label class="todoList_label">
									<input class="todoList_input" type="checkbox" v-model="todo.status" @click="toggleTodo(todo.id)" v-if="!todo.isEdit">
									<span v-if="!todo.isEdit">{{ todo.content }}</span>
									<input class="ms-3 w-100" type="text" v-if="todo.isEdit" v-model="textToUpdate.content">
								</label>
								<a id="cancelBtn" v-if="todo.isEdit" @click="cancelTodoChange">
									<span class="material-symbols-outlined">close</span>
								</a>
								<a v-if="!todo.isEdit">
									<span class="material-symbols-outlined" @click="removeTodo(todo.id)">delete</span>
								</a>
							</li>
						</ul>
						<div class="todoList_statistics">
							<p> {{ todosDoneCount }} 個已完成項目</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal -->
	<div class="modal fade" id="loginErrorModal" tabindex="-1" aria-labelledby="loginErrorModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title fw-bold" id="loginErrorModalLabel">Oops!</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<ul class="text-danger m-1">
						<li class="p-1" v-for="(msg, index) in updateFailedMsg" :key="index">{{ msg }}</li>
					</ul>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>
