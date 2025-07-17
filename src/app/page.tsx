"use client";
const MAX_SIZE_MB = 15; // 2 MB limit
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
import { useEffect, useState } from "react";
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
import { Charts } from "@/components/charts";
import { LucideLoader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Logout from "@/components/logout";

export default function Home() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ArcElement
  );
  const [file, setFile] = useState<File | null>(null);
  const [chartList, setChartList] = useState<Array<any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setstatusMessage] = useState<String | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );
  const oldList = [
    {
      chart_type: "doughnut",
      title: "Distribution of Sleep Disorders",
      x_axis: null,
      y_axis: null,
      labels: ["None", "Insomnia", "Sleep Apnea"],
      data: [250, 80, 44],
      backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      reasoning:
        "A Doughnut chart is excellent for visualizing the proportions of different categories within a whole. 'Sleep Disorder' is a key categorical variable, and assuming a limited number of distinct disorders (e.g., None, Insomnia, Sleep Apnea), this chart clearly shows their prevalence. The `data` values are illustrative counts, summing up to the total number of rows (374).",
    },
    {
      chart_type: "bar",
      title: "Average Sleep Duration by Occupation",
      x_axis: "Occupation",
      y_axis: "Sleep Duration",
      labels: [
        "Doctor",
        "Nurse",
        "Engineer",
        "Teacher",
        "Salesperson",
        "Lawyer",
      ],
      data: [6.5, 6.8, 7.2, 7.5, 7.0, 6.9],
      backgroundColor: [
        "#3F51B5",
        "#2196F3",
        "#03A9F4",
        "#00BCD4",
        "#009688",
        "#4CAF50",
      ],
      reasoning:
        "A Bar chart is ideal for comparing a numerical value (average Sleep Duration) across different discrete categories (Occupations). It clearly shows how sleep patterns might vary among professions. The `data` values represent plausible average sleep durations for each occupation, based on the dataset's overall sleep duration range.",
    },
    {
      chart_type: "bar",
      title: "Average Stress Level by BMI Category",
      x_axis: "BMI Category",
      y_axis: "Stress Level",
      labels: ["Normal", "Overweight", "Obese"],
      data: [4.5, 5.5, 6.5],
      backgroundColor: ["#FFEB3B", "#FFC107", "#FF9800"],
      reasoning:
        "This Bar chart is chosen to illustrate the relationship between a categorical health indicator ('BMI Category') and a continuous measure ('Stress Level'). It effectively compares the average stress levels across different BMI categories, potentially highlighting trends or correlations. The `data` values are plausible average stress levels for each BMI category, reflecting a potential increase with higher BMI.",
    },
    {
      chart_type: "line",
      title: "Average Quality of Sleep by Age Group",
      x_axis: "Age",
      y_axis: "Quality of Sleep",
      labels: ["20-29", "30-39", "40-49", "50-59"],
      data: [7.8, 7.5, 7.0, 6.5],
      backgroundColor: ["#E91E63", "#D81B60", "#C2185B", "#AD1457"],
      reasoning:
        "A Line chart is suitable for showing a trend or progression of a numerical variable ('Quality of Sleep') over an ordered categorical variable or binned continuous variable ('Age Groups'). While 'Age' is continuous, binning it allows us to visualize how sleep quality might change as individuals get older. The `data` values represent a plausible trend of average sleep quality across different age groups, often showing a decline with increasing age.",
    },
  ];

  const handleUpload = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
        const response = await fetch("/api/uploadcsv", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        const dataArray = data;
        setChartList(dataArray);
        setStatusType("success");
        setstatusMessage("Uploaded!");
      }
    } catch (e) {
      setstatusMessage("Error Loading charts. Click here to try again.");
      setStatusType("error");
      console.error("Error: ", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    redirect("/login");
  };

  const { data: session } = useSession();
  console.log(session);

  useEffect(() => {
    console.log("chartList updated:", chartList);
  }, [chartList]);

  return (
    <div className=" bg-slate-200 min-h-screen w-full overflow-x-hidden">
      <header className="flex w-full bg-slate-400 p-2 font-bold justify-between text-lg">
        <div className="">Auto Charts</div>
        {!session ? (
          <Button className="" onClick={handleLogin}>
            Sign In
          </Button>
        ) : (
          <Logout />
        )}
      </header>
      <div className="flex justify-center font-bold">
        <div className="flex flex-col items-center ">
          <h1 className=" text-black text-2xl mt-16 ">
            Welcome to Auto Charts{" "}
          </h1>
          {file ? (
            <label className="cursor-pointer flex flex-col m-8 justify-center items-center text-center border-dashed text-black bg-slate-100 w-96 h-40 rounded-lg border">
              {file.name}
            </label>
          ) : (
            <label className=" cursor-pointer flex flex-col m-8 justify-center items-center text-center border-dashed text-black bg-slate-100 w-96 h-40 rounded-lg border">
              Click here to browse files
              <p className="font-light text-xs">Only csv files are supported</p>
              <input
                type="file"
                accept=".csv"
                placeholder=""
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (
                      file.type === "text/csv" ||
                      (file.name.endsWith(".csv") &&
                        file.size <= MAX_SIZE_BYTES)
                    ) {
                      setFile(file);
                    } else {
                      setFile(null);
                      setstatusMessage(
                        `Please upload a CSV under ${MAX_SIZE_MB} MB`
                      );
                    }
                  }
                }}
                className="hidden"
              ></input>
            </label>
          )}
          <button
            disabled={loading}
            onClick={handleUpload}
            className="text-black bg-slate-50 mb-8 rounded-lg shadow-md  p-2 w-auto"
          >
            {loading ? (
              <LucideLoader2 className="animate-spin" />
            ) : statusMessage ? (
              <div
                className={` ${
                  statusType === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {statusMessage}
              </div>
            ) : (
              "Click here to upload CSV"
            )}
          </button>
          <div className="grid  items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center gap-16">
            {chartList && chartList.length > 0 ? (
              chartList.map((llmData, index) => {
                try {
                  return <Charts llmData={llmData} index={index}></Charts>;
                } catch (error) {
                  return <p>{`Error Fetching this Chart ${error}`}</p>;
                }
              })
            ) : (
              <p className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center text-black">
                No Charts to display
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
