"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TrendPoint } from "../api/get-trend-data";

type TrendChartProps = {
  data: TrendPoint[];
};

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-gray-900">
        過去30日間のトレンド
      </h2>
      <p className="mt-1 text-sm text-gray-500">日別の新規登録数</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              interval="preserveStartEnd"
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 13,
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 13, paddingBottom: 8 }}
            />
            <Area
              type="monotone"
              dataKey="users"
              name="ユーザー"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="spots"
              name="スポット"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="maps"
              name="マップ"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
