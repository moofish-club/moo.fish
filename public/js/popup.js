function PopUp(id, name, blogUrl, avatarUrl) {
    if ('content' in document.createElement('template')) {
        let header = document.getElementById('header')
        let pt = document.querySelector("#points")
        let it = document.querySelector("#intro")
        ptitem = pt.content.querySelector("div")
        ititem = it.content.querySelector("div")

        ptitem.dataset.top = (Math.random() * (0.9 - 0.1) + 0.1) * canvas.height
        ptitem.dataset.left = (Math.random() * (0.9 - 0.1) + 0.1) * canvas.width

        ititem.setAttribute("id", id)
        ptitem.dataset.popover = "#" + id

        mtitile = ititem.querySelector("h5")
        mtitile.innerText = name

        mcontent = ititem.querySelector(".body a")
        mcontent.innerText = blogUrl
        mcontent.setAttribute("href", blogUrl)

        mavatar = ititem.querySelector("img")
        mavatar.src = avatarUrl

        if (ptitem.dataset.top > 0.6 * canvas.height) {
            $(ititem).removeClass("top")
            $(ititem).addClass("bottom")
        } else {
            $(ititem).removeClass("bottom")
            $(ititem).addClass("top")
        }

        if (ptitem.dataset.left > 0.7 * canvas.width) {
            $(ititem).removeClass("right")
            $(ititem).addClass("left")
        } else {
            $(ititem).removeClass("left")
            $(ititem).addClass("right")
        }

        let ptclone = document.importNode(pt.content, true)
        let itclone = document.importNode(it.content, true)
        header.appendChild(ptclone)
        header.appendChild(itclone)
    } else {
        alert("都8102年了，别特么用IE了")
    }
}