import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase';
import Card from '../ui/Card';
import { FolderIcon } from '../../constants';

const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const LoginView: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const auth = getAuth(app);

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="w-full max-w-md px-4">
                <div className="text-center mb-8">
                     <FolderIcon className="h-12 w-12 text-[#6366f1] mx-auto" />
                     <h1 className="text-3xl font-bold mt-3 text-[#1e293b]">Maxwell Vantage</h1>
                     <p className="text-slate-500">Your strategic command center.</p>
                </div>
                <Card className="shadow-xl">
                    <h2 className="text-2xl font-bold text-center text-[#1e293b] mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                     <p className="text-center text-sm text-slate-500 mb-6">{isSignUp ? 'Sign up to get started.' : 'Sign in to continue.'}</p>
                    <form onSubmit={handleAuthAction} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center bg-[#6366f1] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#8b5cf6] transition-colors disabled:opacity-50"
                        >
                            {isLoading && <LoadingSpinner />}
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-slate-500 mt-6">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <button onClick={() => setIsSignUp(!isSignUp)} className="font-semibold text-[#6366f1] hover:underline ml-1">
                             {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default LoginView;