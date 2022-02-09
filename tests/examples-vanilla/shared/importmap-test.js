const warning = document.querySelector('.warning')

import('three')
  .then(() => {
    warning.remove()
  })
  .catch(e => {

    const style = document.createElement('style')
    style.innerHTML = /* css */`
      .warning {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #faa;
        text-align: center;
      }
      .warning p.error {
        background-color: #fff3;
        color: #f00;
        font-style: italic;
        padding: 4px;
        margin-bottom: 16px;
      }
    `
    document.head.append(style)

    document.body.innerHTML = /* html */`
      <div class="warning">
        <p class="error">${e.message}</p>
        <p>
          This page uses <a href="https://github.com/WICG/import-maps">'importmaps'</a>. 
          <br>
          The feature is actually only <a href="https://caniuse.com/import-maps">supported by chromium-based browsers</a>.
        </p>
      </div>
    `
  })
