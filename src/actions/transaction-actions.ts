
'use server'

import { 
  getTransactionsByMonth, 
  createSingleTransaction, 
  createInstallments, 
  CreateTransactionDTO 
} from '../lib/repositories/transactions';
import { revalidatePath } from 'next/cache';

export async function fetchTransactionsByMonthAction(year: number, month: number) {
  try {
    const transactions = await getTransactionsByMonth(year, month);
    return { success: true, data: transactions };
  } catch (error) {
    console.error(`Erro ao buscar transações de ${month}/${year}:`, error);
    return { success: false, error: "Falha ao carregar as transações." };
  }
}

export async function createTransactionAction(data: CreateTransactionDTO, totalInstallments: number = 1) {
  try {
    if (totalInstallments > 1) {
      await createInstallments(data, totalInstallments);
    } else {
      await createSingleTransaction(data);
    }
    revalidatePath('/'); 
    revalidatePath('/transactions'); 
    
    return { success: true, message: "Transação registrada com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return { success: false, error: "Falha ao registrar a movimentação financeira." };
  }
}