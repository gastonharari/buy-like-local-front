// Order tracking — hand-maintained list of tracking numbers shown at
// /track/<id>. No backend yet: to move an order forward, change its
// `current` index and redeploy. Unknown ids 404.

export const TRACKING_STEPS = [
  "Payment received",
  "In preparation",
  "Received",
  "Shipped to customer",
  "Received by customer",
] as const

export type TrackingOrder = {
  /** Index into TRACKING_STEPS of the step the order is currently in. */
  current: number
}

export const TRACKING_ORDERS: Record<string, TrackingOrder> = {
  "b99bf0af-33c1-4e5f-9405-c9804e0379c2": { current: 3 },
}
