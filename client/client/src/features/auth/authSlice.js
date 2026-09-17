import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    registering: false,
    registerError: null,
    registerSuccess: false,
};

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async({username,email,password},thunkAPI)=>{
        try{
            const response = await fetch('http://localhost:5000/users/register',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({username,email,password})
            });
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data);
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async({email,password},thunkAPI)=>{
        try{
            const response = await fetch('http://localhost:5000/users/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({email,password})
            });
            const data = await response.json();
            if (!response.ok) {
                return thunkAPI.rejectWithValue(data);
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: error.message });
        }
    }
);
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        logout:(state)=>{
            state.user = null;
            state.token=null
            state.isAuthenticated = false;
            state.error=null
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        clearRegisterStatus:(state)=>{
            state.registerError = null;
            state.registerSuccess = false;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(registerUser.pending,(state)=>{
            state.registering = true;
            state.registerError = null;
            state.registerSuccess = false;
        })
        .addCase(registerUser.fulfilled,(state)=>{
            state.registering = false;
            state.registerSuccess = true;
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.registering = false;
            state.registerError = action.payload?.message || 'Registration failed';
        })
        .addCase(loginUser.pending,(state)=>{
            state.loading = true;
        state.error = null;
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            state.isAuthenticated = true;
            state.error = null;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || 'Login failed';
        })
    }
})
  export const {logout, clearRegisterStatus} = authSlice.actions;
  export default authSlice.reducer;
