export const formatPrice = (price, time) => {
  price = Number(price)
  const [hours, minutes, _] = time.split(':').map(Number)

  if (hours === 0 && price % 60 == 0) {
    if (price / 60 < 5) {
      return `<span class="price">${decimal(price / 60)} ₽</span> / в минуту`
    }
  }

  if (hours > 1 && minutes === 0) {
    if (hours % 24 == 0) {
      const days = hours / 24

      if (days === 1) {
        return `<span class="price">${decimal(price * hours)} ₽</span> / в день`
      }
      return `<span class="price">${decimal(
        price * hours
      )} ₽</span> / ${days} ${num2str(days, ['день', 'дня', 'дней'])}`
    }

    return `<span class="price">${decimal(
      price * hours
    )} ₽</span> / ${hours} ${num2str(hours, ['час', 'часа', 'часов'])}`
  }

  return `<span class="price">${decimal(price)} ₽</span> / в час`
}

export const decimal = price => {
  return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(price)
}

export function num2str(n, textForms) {
  n = Math.abs(n) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) {
    return textForms[2]
  }
  if (n1 > 1 && n1 < 5) {
    return textForms[1]
  }
  if (n1 === 1) {
    return textForms[0]
  }
  return textForms[2]
}

export const toBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
