
'use server'

import { getAccounts, createAccount, CreateAccountDTO } from '../lib/repositories/accounts';
import { revalidatePath } from 'next/cache';


export async function fetchAccountsAction() {
  try {
    const accounts = await getAccounts();
    return { success: true, data: accounts };
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    return { success: false, error: "Falha ao carregar as contas." };
  }
}


export async function createAccountAction(data: CreateAccountDTO) {
  try {
    const newAccount = await createAccount(data);
    

    revalidatePath('/'); 
    revalidatePath('/accounts');
    
    return { success: true, data: newAccount };
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return { success: false, error: "Falha ao criar a conta." };
  }
}