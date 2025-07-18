


import React from "react";
import { Line } from "react-chartjs-2";


export default function LineChart({dailyResults}) {

  const currentDate=new Date()
  const currentYear=currentDate.getFullYear();
  const currentMonth=currentDate.getMonth();

  const daysInMonth= new Date(currentYear, currentMonth+1, 0).getDate();

  const correctCounts= Array.from({length: daysInMonth}, ()=> 0 );
  const wrongCounts= Array.from({length: daysInMonth}, ()=> 0 );

  dailyResults.forEach(result=>{
    const dayIndex =result.day-1 ;
    correctCounts[dayIndex]=parseInt(result.correct_count, 10);
    wrongCounts[dayIndex]=parseInt(result.wrong_count, 10);
  })
  
  const data = {
    labels: Array.from({length: daysInMonth}, (_, i)=>(i+1).toString()),
    datasets: [
      {
        label: "Correct Answers",
        data: correctCounts,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "#54ae47",
      },
      {
        label: "Wrong Answer",
        data: wrongCounts,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "#3853a4"
      }
    ]
  };

  return (
    <div className="h-[320px]" >
      <Line data={data} options={ {maintainAspectRatio : false} } />
    </div>
  );
}
