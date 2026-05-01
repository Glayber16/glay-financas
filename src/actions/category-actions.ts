'use server'

import { getCategories, getCategoriesByType, createCategory, CreateCategoryDTO } from '../lib/repositories/categories';
import { revalidatePath } from 'next/cache';

export async function fetchCategoriesAction() {
  try {
    const categories = await getCategories();
    return { success: true, data: categories };
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return { success: false, error: "Falha ao carregar as categorias." };
  }
}

export async function fetchCategoriesByTypeAction(type: 'income' | 'expense') {
  try {
    const categories = await getCategoriesByType(type);
    return { success: true, data: categories };
  } catch (error) {
    console.error(`Erro ao buscar categorias do tipo ${type}:`, error);
    return { success: false, error: "Falha ao filtrar as categorias." };
  }
}

export async function createCategoryAction(data: CreateCategoryDTO) {
  try {
    const newCategory = await createCategory(data);
    
    
    revalidatePath('/categories');
    revalidatePath('/transacoes/nova');
    
    return { success: true, data: newCategory };
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return { success: false, error: "Falha ao criar a categoria." };
  }
}