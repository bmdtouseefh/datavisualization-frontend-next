"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Download, FileText, Image, FileSpreadsheet } from "lucide-react";
import { useRef } from "react";

import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import pkg from "file-saver";
import { useSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
const { saveAs } = pkg;

export type DownloadFormat = "PDF" | "JPEG" | "Excel";

interface DownloadDropdownProps {
  onDownload?: (format: DownloadFormat) => void;
}

export function DownloadDropdown({ onDownload }: DownloadDropdownProps) {
  const handleDownload = (format: DownloadFormat) => {
    if (onDownload) {
      onDownload(format);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`bg-gradient-to-r text-black bg-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-teal-300 `}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-48 p-2 shadow-2xl border-gray-100 bg-white/95 backdrop-blur-sm"
      >
        <DropdownMenuItem
          onClick={() => handleDownload("PDF")}
          className="group cursor-pointer px-3 py-3 rounded-md transition-all duration-200 hover:bg-gradient-to-r hover:from-white hover:to-slate-100 hover:text-gray-700 focus:bg-gradient-to-r focus:from-white focus:to-slate-300 focus:text-gray-700"
        >
          <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Save as PDF</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleDownload("JPEG")}
          className="group cursor-pointer px-3 py-3 rounded-md transition-all duration-200 hover:bg-gradient-to-r  hover:from-white hover:to-slate-100 hover:text-gray-700 focus:bg-gradient-to-r focus:from-white focus:to-slate-300 focus:text-gray-700"
        >
          <Image className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Save as JPEG</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleDownload("Excel")}
          className="group cursor-pointer px-3 py-3 rounded-md transition-all duration-200 hover:bg-gradient-to-r hover:from-white hover:to-slate-100 hover:text-gray-700 focus:bg-gradient-to-r focus:from-white focus:to-slate-300 focus:text-gray-700"
        >
          <FileSpreadsheet className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Save as Excel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Charts = ({ llmData, index }: { llmData: any; index: any }) => {
  const chartRef = useRef<any>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleDownload = async (format: DownloadFormat) => {
    if (!session) {
      redirect("/login");
    }
    const canvas = chartRef.current?.canvas;
    if (format === "JPEG") {
      const image = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = "chart.jpg";
      link.click();
    }

    if (format === "PDF") {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("chart.pdf");
    }
    if (format === "Excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("chart data");
      worksheet.columns = [
        { header: "Label", key: "label", width: 20 },
        { header: llmData.y_axis, key: "value", width: 20 },
      ];
      llmData.labels.forEach((label: string, index: number) => {
        worksheet.addRow({
          label,
          value: llmData.data[index],
        });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "chart.xlsx");
    }
  };

  return (
    <div>
      <div key={index} className="  bg-white p-4 h-96 rounded-lg shadow-md">
        {llmData.chart_type === "bar" ? (
          <Bar
            className="pb-4"
            ref={chartRef}
            data={{
              labels: llmData.labels.map((a: any) => a),
              datasets: [
                {
                  label: llmData.y_axis,
                  data: llmData.data.map((a: any) => a),
                  backgroundColor: llmData.backgroundColor,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: llmData.title,
                },
                legend: {
                  display: true,
                  labels: llmData.legend,
                },
              },
              maintainAspectRatio: false,
              responsive: true,
            }}
          ></Bar>
        ) : llmData.chart_type === "pie" ? (
          <Pie
            ref={chartRef}
            data={{
              labels: llmData.labels.map((a: any) => a),
              datasets: [
                {
                  label: llmData.y_axis,
                  data: llmData.data.map((a: any) => a),
                  backgroundColor: llmData.backgroundColor,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: llmData.title,
                },
                legend: {
                  display: false,
                },
              },
            }}
          ></Pie>
        ) : llmData.chart_type === "doughnut" ? (
          <Doughnut
            ref={chartRef}
            data={{
              labels: llmData.labels.map((a: any) => a),
              datasets: [
                {
                  label: llmData.y_axis,
                  data: llmData.data.map((a: any) => a),
                  backgroundColor: llmData.backgroundColor,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: llmData.title,
                },
                legend: {
                  display: true,
                },
              },
            }}
          ></Doughnut>
        ) : (
          <Line
            ref={chartRef}
            data={{
              labels: llmData.labels.map((a: any) => a),
              datasets: [
                {
                  label: llmData.y_axis,
                  data: llmData.data.map((a: any) => a),
                  backgroundColor: llmData.backgroundColor,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: llmData.title,
                },
                legend: {
                  display: true,
                },
              },
            }}
          ></Line>
        )}
      </div>
      <div className="flex justify-center w-full mt-2">
        <DownloadDropdown onDownload={handleDownload}></DownloadDropdown>
      </div>
    </div>
  );
};
