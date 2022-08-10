<script>
	import { signIn, signUserOut, user } from '$lib/firebase/firebase.js';
	import Modal from '$lib/Modal.svelte';
	let newuser = false;
	let showModal = false;
	let chooseMethod = false;
	let logInWithEmail = false;
	let forgotPassword = false;
	let sentmessage = false;
	let failedLoginWithEmail = false;
	let failedSignupWithEmail = false;
	let email = '';
	let password = '';
	let /** @type {string|null} */message = ''

	const resetState = () => {
		newuser = false;
		showModal = false;
		chooseMethod = false;
		logInWithEmail = false;
		forgotPassword = false;
		sentmessage = false;
		failedLoginWithEmail = false;
		failedSignupWithEmail = false;
		message = ''
	};

	const signInEmail = async () => {
		let result = await signIn.email(email, password);
		if (result != 'ok') {
			failedLoginWithEmail = true;
		} else {
			resetState();
		}
	};

	const signUpEmail = async () => {
		let result = await signIn.newUser(email, password)
		if (result != 'ok') {
			failedSignupWithEmail = true
			message = result;
		} else {
			resetState();
		}
	};

</script>

<div id="user">
	{#if $user}	
		{$user.displayName ? $user.displayName : $user.email}
		<div id="usrpic" style:background-image={`url(${$user.photoURL})`} />
		<!-- <div id ="usrpic"></div> -->
		<button on:click={signUserOut}>Log out</button>
	{:else}
		<div id="login">
			<button
				on:click={() => {
					showModal = true;
					chooseMethod = true;
				}}>Log in</button
			>
		</div>
	{/if}
</div>

<Modal bind:show={showModal} on:hide={resetState}>
	{#if chooseMethod}
		<div id="login_methods">
			<fieldset>
				<legend>Sign in</legend>
				<button
					on:click={() => {
						signIn.google().then(() => {
							showModal = false;
						});
					}}>Log in with Google</button
				>
				<button
					on:click={() => {
						logInWithEmail = true;
						chooseMethod = false;
					}}>Log in with e-mail and password</button
				>
				<button
					on:click={() => {
						newuser = true;
						chooseMethod = false;
					}}>Sign up</button
				>
				<button on:click={() => (showModal = false)}>Cancel</button>
			</fieldset>
		</div>
	{/if}
	{#if newuser}
		<div class="input">
				<fieldset>
					<label for="email">Email </label>
					<input type="text" id="email" bind:value={email} />
					<label for="password">Password </label>
					<input type="password" id="password" bind:value={password} />
					{#if failedSignupWithEmail}
						<p class="warn">*Something went wrong <br/>{message}</p>
					{/if}
					<div class="buttonset">
						<button disabled={!(email && password)} on:click={signUpEmail}
							>Sign up</button
						>
						<button on:click={resetState}>Cancel</button>
					</div>
				</fieldset>
		</div>
	{/if}
	{#if logInWithEmail}
		<div class="input">
			<fieldset>
				<legend>Sign in</legend>
				<label for="email">Email </label>
				<input type="text" id="email" bind:value={email} />
				<label for="password">Password </label>
				<input type="password" id="password" bind:value={password} />
				{#if failedLoginWithEmail}
					<p class="warn">*Wrong email or password.</p>
				{/if}
				<div class="buttonset">
					<button disabled={!(email && password)} on:click={signInEmail}>Sign in</button>
					<button on:click={resetState}>Cancel</button>
					<button
						class="forgot_password"
						on:click={() => {
							forgotPassword = true;
							logInWithEmail = false;
						}}>I forgot my password</button
					>
				</div>
			</fieldset>
		</div>
	{/if}
	{#if forgotPassword}
		<div class="input">
      <fieldset>
			<label for="email">Email </label>
			<input type="text" id="email" bind:value={email} />
			<div class="buttonset">
				<button
					disabled={!email}
					on:click={() => {
						signIn.forgotPasswordEmail(email);
						forgotPassword = false;
						sentmessage = true;
					}}>Reset my password</button
				>
			</div>
			<div class="buttonset">
				<button on:click={resetState}>Cancel</button>
			</div>
      </fieldset>
		</div>
	{/if}
	{#if sentmessage}
		<div class="input">
      <fieldset>
			<p>A link to reset your password has been sent to {email}.</p>
			<div class="buttonset">
				<button
					on:click={resetState}>OK</button>
			</div>
      </fieldset>
		</div>
	{/if}
</Modal>

<style lang="scss">
	fieldset {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: fit-content;
		border: solid thin grey;
		border-radius: 4px;
		padding: 15px;
	}

	#login_methods {
		background-color: white;
		padding: 30px;
		border-radius: 4px;
		fieldset {
			button {
				width: 100%;
				white-space: nowrap;
				padding: 5px 10px;
			}
		}
	}

	button {
		width: 100%;
		white-space: nowrap;
	}

	.input {
		min-width: 250px;
		width: fit-content;
		padding: 30px;
		background-color: white;
		border: solid thin grey;
		border-radius: 4px;
		input {
			font-size: large;
			color: darkslategrey;
			border-radius: 4px;
			border-color: #ccc;
			border-width: thin;
			border-style: solid;
			padding: 3px;
			margin-bottom: 3px;
		}
	}

	label {
		margin-bottom: 3px;
		font-size: small;
	}
  .warn {
    color:red;
		margin-bottom: 3px;
		font-size: small;
	}

	div.buttonset {
		width: 100%;
		display: flex;
		flex-direction: row;
		margin: 0px;
		padding: 5px 0px;
		gap: 5px;
		justify-content: space-between;
		button {
			width: 100%;
		}
	}

	#user {
		white-space: nowrap;
		display: flex;
		align-items: center;
	}
	#usrpic {
		padding: 20px;
		border-radius: 40px;
		margin: 10px;
		background-position: center;
		background-size: cover;
		background-color: grey;
	}
</style>
