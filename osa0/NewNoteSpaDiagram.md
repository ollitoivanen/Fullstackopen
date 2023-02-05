```mermaid
sequenceDiagram
    participant browser
    participant server
    
    Note right of browser: Event handler is attached to notice when form is submitted and prevent default handling.
    Note right of browser: Browser JavaScript rerenders the content without refreshing the whole page.

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa

    activate server
    server->>server: Save note
    server->>browser: 201 Created

    deactivate server
```
