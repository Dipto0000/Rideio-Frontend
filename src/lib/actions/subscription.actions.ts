"use server"

import { fetchWithAuth } from "./fetch-with-auth"

export async function initiatePayment(accessToken: string, planType: "MONTHLY" = "MONTHLY") {
  return fetchWithAuth(`/api/v1/subscriptions/init`, accessToken, {
    method: "POST",
    body: JSON.stringify({ planType }),
  })
}

export async function getSubscriptionStatus(accessToken: string) {
  return fetchWithAuth(`/api/v1/subscriptions/status`, accessToken)
}

export async function getPaymentHistory(accessToken: string, page = 1) {
  return fetchWithAuth(`/api/v1/subscriptions/history?page=${page}&limit=10`, accessToken)
}

export async function cancelPendingPayment(accessToken: string) {
  return fetchWithAuth(`/api/v1/subscriptions/cancel-pending`, accessToken, {
    method: "POST",
  })
}
