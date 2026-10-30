'use client'
import { useEffect, useState } from 'react'
import Header from '@/src/components/jobSiteDetails/components/header'
import DumpsterChartContainer from '@/src/components/jobSiteDetails/components/dumpsterChartContainer'
import { ReportImagesProvider } from '@/src/utils/context/report-images-context'
import { warmAllDisplayImageSrcs } from '@/src/utils/heicDisplay'

export default function ExportJobsites() {
  const [report, setReport] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      let data: any = null

      // keep polling until data is available
      while (!data || data.status === 'no-data') {
        const res = await fetch('/api/jobsite-report-data')
        data = await res.json()
        if (data && data.status !== 'no-data') {
          // Pre-convert any HEIC images before rendering the report. Puppeteer's
          // readiness check only waits for chart selectors, so conversions must
          // be cached up-front for images to appear in the captured PDF.
          const imagePaths: string[] = Object.values(
            (data.imagesByWasteStreamId ?? {}) as Record<number, any[]>
          )
            .flat()
            .map((img) => img?.file?.path)
            .filter(Boolean)
          try {
            await warmAllDisplayImageSrcs(imagePaths)
          } catch {
            // A failed conversion should not block the report; the affected
            // image falls back to "Preview unavailable".
          }
          setReport(data)
          break
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)) // wait 1 sec
      }
    }

    fetchData()
  }, [])

  if (!report) return <div id="report-root">Waiting for data...</div>

  // Determine values based on weekly flag
  const useWeeklyData = report.weekly
  const {
    startDate: startDateValue = report.startDate ??
      new Date(report.monthGraph?.startDate ?? new Date()),
    endDate: endDateValue = report.endDate ??
      new Date(report.monthGraph?.endDate ?? (new Date() || new Date())),
    monthName: monthNameValue = report.monthGraph?.monthName ??
      `${report.started} - ${report.ended}`,
  } = useWeeklyData
    ? {
        startDate: report.started,
        endDate: report.ended,
        monthName: `${report.started} - ${report.ended}`,
      }
    : {}

  return (
    <ReportImagesProvider images={report?.imagesByWasteStreamId ?? {}}>
    <div id="report-root">
      <section className="container white-area">
        <Header
          jobDetails={{
            id: report.jobSite?.id ?? 0,
            clientName: report.jobSite?.clientName ?? '',
            title: report.jobSite?.title ?? '',
            address: report.jobSite?.address ?? '',
            sustainabilityGoal: report.jobSite?.sustainabilityGoal ?? 0,
            name: report.jobSite?.name ?? '',
            phone: report.jobSite?.phone ?? '',
            email: report.jobSite?.email ?? '',
            completionBy:
              report.jobSite?.completionBy ??
              new Date(report.jobSite.completionBy),
            powerplants: report.jobSite?.powerplants?.name ?? '',
            size: report.jobSite?.sizeSqft ?? 0,
            startDate: startDateValue,
            photo: report.jobSite?.photo ?? null,
            status: report.jobSite?.status ?? null,
          }}
          newJobsite={true}
          setStartDateFilter={() => {}}
          setEndDateFilter={() => {}}
          setPageRefresh={() => {}}
          treeStats={report.treeStats}
          dumpsterStats={report.barGraph}
          endDateFilter={endDateValue}
          weekly={report.weekly}
          reporting={true}
          isAdmin={report.isAdmin}
        />

        <DumpsterChartContainer
          jobSiteDetailsData={report.jobSite}
          reporting={true}
          isAdmin={report.isAdmin}
          pageRefresh={true}
          setPageRefresh={() => {}}
          setImages={() => {}}
          setImagesCount={() => {}}
          wasteStreamList={[]}
          dumpsterOptions={[]}
          startDateFilter={startDateValue}
          endDateFilter={endDateValue}
          // Prefer month-wise data if provided; fall back to single month.
          // Key the fallback by monthGraph.monthName ("July 2026") — weekly
          // reports label sections by month via getMonths(), so a
          // "started - ended" key would never match and the section
          // would render empty.
          dumpsterDataByMonth={
            report.monthsGraph?.dataByMonth ||
            (report.monthGraph?.data
              ? {
                  [report.monthGraph?.monthName ?? monthNameValue]:
                    report.monthGraph.data,
                }
              : undefined)
          }
          readOnly={true}
        />
      </section>
    </div>
    </ReportImagesProvider>
  )
}
