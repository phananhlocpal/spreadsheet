export function noti(title, message) {
    Swal.fire(
        title,
        message,
        'success'
    )
}

export function error(title, message) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: message,
    })
}