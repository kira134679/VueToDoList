<script setup>
	import axios from 'axios';
	import { ref, computed } from 'vue';
	import { useBaseUrlStore } from '@/stores/api';
	import { storeToRefs } from 'pinia';
	import { useRouter } from 'vue-router';

	const baseUrlStore = useBaseUrlStore();
	const { baseUrl } = storeToRefs(baseUrlStore);
	const router = useRouter();

	const signUpField = ref(
		{
			email: "",
  		nickname: "",
			password: "",
		}
	);

	const signUpErrorMsg = ref("");

	const isSignUpDisabled = computed(() => {
		const { email, nickname, password } = signUpField.value;
		if (!email || !nickname || !password) {
			return true
		}
		return false
	});
	
	const signUp = async () => {
		try {
			const res = await axios.post(`${baseUrl.value}/users/sign_up`, signUpField.value);
			console.log(`註冊成功! UID: ${res.data.uid}`);

			router.push('/');
		} catch (error) {
			console.log(error)
			/**
			 * 用戶已存在時回傳的message不是陣列，和其他錯誤時的message類型不同。
			 * 為了統一解法，先都加進陣列再用flat降為一維陣列，使join可正常運作。
			 */
			signUpErrorMsg.value = [error.response.data.message].flat();
			
			new bootstrap.Modal(document.getElementById('signUpErrorModal')).show();
		}
	}
</script>

<template>
	<!-- sign up -->
	<div id="signUpPage" class="bg-yellow">
		<div class="conatiner signUpPage vhContainer">
			<div class="side">
				<a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
				<img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
			</div>
			<div>
				<form class="formControls" action="index.html">
					<h2 class="formControls_txt">註冊帳號</h2>
					<label class="formControls_label" for="email">Email</label>
					<input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="signUpField.email">
					<span v-if="signUpField.email === ''">此欄位不可留空</span>
					<label class="formControls_label" for="name">您的暱稱</label>
					<input class="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" required v-model="signUpField.nickname">
					<span v-if="signUpField.nickname === ''">此欄位不可留空</span>
					<label class="formControls_label" for="pwd">密碼</label>
					<input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="signUpField.password">
					<span v-if="signUpField.password === ''">此欄位不可留空</span>
					<input class="formControls_btnSubmit" type="button" @click="signUp" value="註冊帳號" :disabled="isSignUpDisabled">
					<RouterLink to="/login" class="formControls_btnLink">登入</RouterLink>
				</form>
			</div>
		</div>
	</div>

	<!-- Modal -->
	<div class="modal fade" id="signUpErrorModal" tabindex="-1" aria-labelledby="signUpErrorModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title fw-bold" id="signUpErrorModalLabel">Oops!</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<ul class="text-danger m-1">
						<li class="p-1" v-for="(msg, index) in signUpErrorMsg" :key="index">{{ msg }}</li>
					</ul>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
</template>
