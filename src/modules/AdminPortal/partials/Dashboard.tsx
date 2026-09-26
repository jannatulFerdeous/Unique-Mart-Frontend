"use client";

import { useMemo, useState } from "react";
import { useCarts } from "@/shared/libs/admin/carts";
import { useCustomers } from "@/shared/libs/admin/customers";
import {
  formatMoney,
  formatMoneyCompact,
  formatCount,
  formatAgo,
} from "@/shared/libs/admin/format";
import {
  kpis,
  methodSplit,
  reorderList,
  revenueSeries,
  statusCounts,
  topProducts,
  within,
} from "@/shared/libs/admin/metrics";
import { useOrders } from "@/shared/libs/admin/orders";
import { useProducts } from "@/shared/libs/admin/products";
import { METHOD_LABELS } from "@/shared/libs/admin/settings";
import { cn } from "@/shared/utils/cn";
import { PAGE_SIZE, RANGES, admin_data } from "../config/constants";
import { BarList, type BarItem } from "../components/BarList";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { RevenueChart } from "../components/RevenueChart";
import { StatTile } from "../components/StatTile";
import { StatusPill } from "../components/StatusPill";
import { Table, TableScroll, Td, TdNum, Th, ThNum, Tr } from "../components/Table";

const toTrend = (values: number[], buckets = 12): number[] => {
  if (values.length <= buckets) return values;

  const size = values.length / buckets;
  return Array.from({ length: buckets }, (_, index) => {
    const slice = values.slice(Math.floor(index * size), Math.floor((index + 1) * size));
    return slice.reduce((sum, value) => sum + value, 0);
  });
};

export function Dashboard() {
  const { common, orderStatus } = admin_data;

  const orders = useOrders();
  const products = useProducts();
  const customers = useCustomers();
  const carts = useCarts();

  const [days, setDays] = useState(30);

  const series = useMemo(() => revenueSeries(orders, days), [orders, days]);
  const figures = useMemo(
    () => kpis(orders, customers, carts, products, days),
    [orders, customers, carts, products, days],
  );
  const windowed = useMemo(() => within(orders, days), [orders, days]);

  const statuses = useMemo(() => statusCounts(windowed), [windowed]);
  const methods = useMemo(() => methodSplit(windowed), [windowed]);
  const best = useMemo(() => topProducts(windowed, 6), [windowed]);
  const reorder = useMemo(() => reorderList(products, 6), [products]);
  const recent = useMemo(() => orders.slice(0, 8), [orders]);

  const rangeLabel = `vs previous ${days} days`;

  const statusBars: BarItem[] = useMemo(
    () =>
      (Object.keys(statuses) as (keyof typeof statuses)[])
        .filter((status) => statuses[status] > 0)
        .map((status) => ({
          id: status,
          label: orderStatus[status].label,
          value: statuses[status],
          display: formatCount(statuses[status]),
          tone: orderStatus[status].tone,
        })),
    [statuses, orderStatus],
  );

  const methodBars: BarItem[] = useMemo(
    () =>
      methods.map((split) => ({
        id: split.method,
        label: METHOD_LABELS[split.method],
        value: split.amount,
        display: formatMoneyCompact(split.amount),
        secondary: `${formatCount(split.orders)} ${split.orders === 1 ? "order" : "orders"}`,
      })),
    [methods],
  );

  const productBars: BarItem[] = useMemo(
    () =>
      best.map((product) => ({
        id: product.slug,
        label: product.name,
        value: product.revenue,
        display: formatMoneyCompact(product.revenue),
        secondary: `${formatCount(product.units)} sold`,
      })),
    [best],
  );

  return (
    <>
      <ScreenHeader
        title="Dashboard"
        blurb={admin_data.nav[0].items[0].blurb}
        actions={
          <div className="flex items-center gap-1 rounded-control border border-line bg-surface p-1">
            {RANGES.map((range) => (
              <button
                key={range.days}
                type="button"
                onClick={() => setDays(range.days)}
                aria-pressed={days === range.days}
                className={cn(
                  "rounded-control px-2.5 py-1.5 text-sm transition-colors",
                  days === range.days
                    ? "bg-tertiary text-tertiary-contrast font-medium"
                    : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          hero
          className="md:col-span-2"
          label={`Revenue, last ${days} days`}
          value={formatMoneyCompact(figures.revenue)}
          delta={figures.revenueDelta}
          deltaLabel={rangeLabel}
          trend={toTrend(series.map((point) => point.revenue))}
        />
        <StatTile
          label="Orders"
          value={formatCount(figures.orders)}
          delta={figures.ordersDelta}
          deltaLabel={rangeLabel}
          trend={toTrend(series.map((point) => point.orders))}
        />
        <StatTile
          label="Awaiting fulfilment"
          value={formatCount(figures.openOrders)}
          note="all orders, not just this window"
          upIsGood={false}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Average order"
          value={formatMoneyCompact(figures.average)}
          note={`across ${formatCount(figures.orders)} orders`}
        />
        <StatTile
          label="Owed to the shop"
          value={formatMoneyCompact(figures.unpaid)}
          note="all unpaid or pending payments"
          upIsGood={false}
        />
        <StatTile
          label="Abandoned baskets"
          value={formatCount(figures.abandonedCarts)}
          note={`${formatMoneyCompact(figures.abandonedValue)} left behind`}
          upIsGood={false}
        />
        <StatTile
          label="New customers"
          value={formatCount(figures.newCustomers)}
          note={`in the last ${days} days`}
        />
      </div>

      <Panel
        title={`Revenue per day, last ${days} days`}
        description="Cancelled and refunded orders are left out, so this is money earned rather than orders taken."
      >
        <RevenueChart series={series} />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Orders by status"
          description={`Where the last ${days} days of orders are up to.`}
        >
          <BarList items={statusBars} emptyLabel="No orders in this window." />
        </Panel>

        <Panel
          title="How customers paid"
          description="Completed payments only — an unpaid cash-on-delivery order has not told us anything yet."
        >
          <BarList items={methodBars} emptyLabel="No payments have landed in this window." />
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Best sellers by revenue"
          description="Ranked by money, not units: twenty cases are not a better week than one MacBook."
        >
          <BarList items={productBars} emptyLabel="Nothing has sold in this window." />
        </Panel>

        <Panel
          title="Reorder soon"
          description={`${formatMoneyCompact(figures.inventoryValue)} on the shelves · ${formatCount(figures.lowStock)} low · ${formatCount(figures.outOfStock)} out of stock.`}
          bodyClassName={reorder.length ? "py-0" : undefined}
        >
          {reorder.length === 0 ? (
            <EmptyState title="Everything is stocked" body="No product is at its reorder point." />
          ) : (
            <TableScroll>
              <Table className="min-w-lg">
                <thead>
                  <tr>
                    <Th>Product</Th>
                    <ThNum>In stock</ThNum>
                    <ThNum>Reorder at</ThNum>
                  </tr>
                </thead>
                <tbody>
                  {reorder.map((product) => (
                    <Tr key={product.slug}>
                      <Td>
                        <span className="font-medium text-ink">{product.name}</span>
                        <span className="mt-0.5 block text-xs text-ink-subtle">{product.sku}</span>
                      </Td>
                      <TdNum>
                        <StatusPill
                          label={product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                          tone={product.stock === 0 ? "critical" : "warning"}
                        />
                      </TdNum>
                      <TdNum className="text-ink-muted">{product.reorderAt}</TdNum>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableScroll>
          )}
        </Panel>
      </div>

      <Panel
        title="Latest orders"
        description={`${formatCount(Math.min(PAGE_SIZE, recent.length))} most recent, whatever the range above.`}
        bodyClassName="py-0"
      >
        {recent.length === 0 ? (
          <EmptyState title="No orders yet" body={common.noResults} />
        ) : (
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Placed</Th>
                  <Th>Items</Th>
                  <Th>Status</Th>
                  <Th>Payment</Th>
                  <ThNum>Total</ThNum>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <Tr key={order.id}>
                    <Td>
                      <span className="font-medium text-ink">{order.id}</span>
                    </Td>
                    <Td className="whitespace-nowrap text-ink-muted">{formatAgo(order.placedAt)}</Td>
                    <Td className="text-ink-muted">
                      {order.items.length} {order.items.length === 1 ? "line" : "lines"}
                    </Td>
                    <Td>
                      <StatusPill
                        label={orderStatus[order.status].label}
                        tone={orderStatus[order.status].tone}
                      />
                    </Td>
                    <Td>
                      <StatusPill
                        label={admin_data.paymentStatus[order.payment.status].label}
                        tone={admin_data.paymentStatus[order.payment.status].tone}
                      />
                    </Td>
                    <TdNum className="font-medium">{formatMoney(order.total)}</TdNum>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </Panel>

    </>
  );
}
