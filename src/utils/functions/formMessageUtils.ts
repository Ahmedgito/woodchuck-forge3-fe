type EntityMessageKeys = {
  created: string
  updated: string
  proCreated: string
  freeCreated: string
  proUpdated: string
  freeUpdated: string
}

export const getSuccessMessage = (
  isEdit: boolean,
  accountTypeChanged: boolean,
  newIsProAccount: boolean,
  messageKeys: EntityMessageKeys
): string => {
  if (isEdit) {
    // update case
    if (!accountTypeChanged) {
      return messageKeys.updated
    } else if (newIsProAccount) {
      return messageKeys.proUpdated
    } else {
      return messageKeys.freeUpdated
    }
  } else {
    // create case
    if (!accountTypeChanged) {
      return messageKeys.created
    } else if (newIsProAccount) {
      return messageKeys.proCreated
    } else {
      return messageKeys.freeCreated
    }
  }
}
