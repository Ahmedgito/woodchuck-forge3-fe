type SearchableUser = {
  name?: string | null
  company?: string | null
  username?: string | null
}

export const filterUsersBySearch = <T extends SearchableUser>(
  users: T[],
  searchTerm: string | null | undefined
): T[] => {
  const term = searchTerm?.trim().toLowerCase()
  if (!term) return users

  return users.filter((user) => {
    const name = user.name?.toLowerCase() ?? ''
    const company = user.company?.toLowerCase() ?? ''
    const username = user.username?.toLowerCase() ?? ''

    return (
      name.includes(term) || company.includes(term) || username.includes(term)
    )
  })
}
