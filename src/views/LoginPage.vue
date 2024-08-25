<script setup>
	import axios from 'axios';
	import { ref, computed } from 'vue';
	import { useBaseUrlStore } from '@/stores/api';
	import { storeToRefs } from 'pinia';
	import { useRouter } from 'vue-router';

	const baseUrlStore = useBaseUrlStore();
	const { baseUrl } = storeToRefs(baseUrlStore);
	const router = useRouter();

	const loginField = ref(
		{
			email: "qq123@gmail.com",
			password: "zxc12345"
		}
	);

	const loginErrorMsg = ref("");

	const isLoginDisabled = computed(() => {
		const { email, password } = loginField.value;
		if (!email || !password) {
			return true
		}
		return false
	})

	const login = async () => {
		try {
			const res = await axios.post(`${baseUrl.value}/users/sign_in`, loginField.value);
			console.log(res);

			// save cookie
			document.cookie = `todoToken=${res.data.token};`;
			console.log("cookie saved.")

			router.push('/todolist');
		} catch (error) {
			console.log(error);

			loginErrorMsg.value = [error.response.data.message].flat();
			
			new bootstrap.Modal(document.getElementById('loginErrorModal')).show();
		}
	}
</script>

<template>
	<!-- login_page -->
	<div id="loginPage" class="bg-yellow">
		<div class="conatiner loginPage vhContainer ">
			<div class="side">
				<a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
				<img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
			</div>
			<div>
				<form class="formControls" action="index.html">
					<h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
					<label class="formControls_label" for="email">Email</label>
					<input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="loginField.email">
					<span v-if="loginField.email === ''">此欄位不可留空</span>
					<label class="formControls_label" for="pwd">密碼</label>
					<input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="loginField.password">
					<span v-if="loginField.email === ''">此欄位不可留空</span>
					<input class="formControls_btnSubmit" type="button" @click="login" value="登入" :disabled="isLoginDisabled">
					<RouterLink to="/" class="formControls_btnLink">註冊帳號</RouterLink>
				</form>
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
						<li class="p-1" v-for="(msg, index) in loginErrorMsg" :key="index">{{ msg }}</li>
					</ul>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>
