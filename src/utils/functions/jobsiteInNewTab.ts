export const openJobSiteInNewTab = (id: number) => {
  if (!id) return
  const url = `/jobSites?id=${id}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
