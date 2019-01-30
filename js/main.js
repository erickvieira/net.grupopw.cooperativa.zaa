firebase.initializeApp(config)
let email = ''
let invite = undefined
const modalId = 'alert'

function createInvite(onInit, onFinish) {
  onInit()
  if (email && email != '') {
    const key = btoa(email)
    invite = {
      code: (Math.ceil((Date.now() / 997))).toString(16),
      created_at: Date.now(),
      email: email
    }
    console.log(key)
    return firebase.database().ref(`/invites/${key}`).set({
      ...invite
    }).then((data) => {
      console.log(data)
      onFinish()
    })
  } else onFinish()
}

function getEmail() {
  return email;
}

function closeModal() {
  const modals = document.getElementsByClassName('modal')

  for (let modal of modals) {
    modal.classList.remove('show')
    modal.setAttribute('aria-hidden', 'true')
    modal.setAttribute('style', 'display: none')
  }

  const modalBackdrops = document.querySelector('.modal-backdrop')
  modalBackdrops.style.display = 'none'
}

function presentModal(title, message, action) {
  confirmModalAction = action
  const modal = document.getElementById(modalId)

  modal.querySelector('.modal-title').innerHTML = `
  <i class="fas fa-exclamation-triangle"></i>
  ${title}
  `
  modal.querySelector('.modal-body').innerHTML = message
  modal.querySelector('.modal-footer').style.display = email && email != '' ? 'block' : 'none'
  modal.classList.add('show')
  modal.setAttribute('aria-hidden', 'false')
  modal.setAttribute('style', 'display: block')

  const modalBackdrops = document.querySelector('.modal-backdrop')
  modalBackdrops.style.display = 'block'
}

let confirmModalAction = () => {
  console.log('No action')
}

function confirmFirebaseInclude() {
  let modalFooter = document.querySelector('.modal-footer')
  createInvite(() => {
    for (let c of modalFooter.children) {
      c.disabled = true;
    }
    let btnConfirm = modalFooter.children[1]
    btnConfirm.children[0].className = 'fas fa-spinner fa-spin'
  }, () => {
    setTimeout(() => {
      for (let c of modalFooter.children) {
        c.disabled = false;
      }
      let btnConfirm = modalFooter.children[1]
      btnConfirm.children[0].className = 'fas fa-check'
      showAnotherModal(modalFooter.children)
    }, 2000)
  })
}

function showAnotherModal(btnRefs) {
  btnRefs[0].style.display = 'none'
  btnRefs[1].innerHTML = `
  OK
  <i class="fas fa-check"></i>
  `
  presentModal(
    'Convite cadastrado!',
    `O usuário <b>${email}</b> agora pode usar o seguinte código para se cadastrar no App:<br>
    <span class="display-4">${invite.code}</span>`,
    () => {
      closeModal()
      email = ''
      document.querySelector('input[name="email-invitation"]').value = ''
      btnRefs[0].style.display = 'inline-block'
      btnRefs[1].innerHTML = `
      Confirmar
      <i class="fas fa-check"></i>
      `
    }
  )
}