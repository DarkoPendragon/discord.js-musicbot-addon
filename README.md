# Discord.JS Muzykobot
***
To prosty moduł Node.JS bazowany na innych projektach botów muzycznych dla Discord.JS.

__Lista komend: (nazwy domyślne)__  
* `musichelp [nazwa komendy]`: Wyświetla listę komend muzycznych.
* `play <url>|<wyszukiwana piosenka>`: Puszcza muzykę z platformy [YouTube](https://youtube.com/)
* `search <wyszukiwania piosenka>`: Wyszukuje 10 piosenek o podobnym tytule z platformy [YouTube](https://youtube.com/).
* `skip [liczba]`: Pomija jedną lub kilka piosenek z kolejki.
* `queue [pozycja]`: Wyświetla aktualną kolejkę dla serwera.
* `pause`: Zatrzymuje odtwarzanie muzyki.
* `resume`: Wznawia odtwarzanie muzyki.
* `remove [pozycja]`: Usuwa piosenkę o danej pozycji z kolejki.
* `volume`: Ustawia głośność odtwarzania [0-200].
* `leave`: Czyści kolejkę i wychodzi z kanału.
* `clearqueue`: Czyści kolejkę.
* `np`: Pokazuje informacje o aktualnie granej piosence. 

__Uprawnienia:__  
* Jeżeli `anyoneCanSkip` jest ustawione na `true`, to każdy użytkownik może pominąć piosenki.
* Jeżeli `anyoneCanAdjust` jest ustawione na `true`, to każdy użytkownik może zmienić głośność.
* Jeżeli `ownerOverMember` jest ustawione na `true`, to właściciel bota (`ownerID`) ma uprawnienia do wykonywania wszystkich komend muzycznych.

***
# Instalacja
***  
__Przed instalacją pakietu:__  
1. `npm install discord.js`  
Zalecana wersja stable. Obecnie to wersja 11.4.2.

2. `ffmpeg`  
Bardzo ważna biblioteka. Nie instaluj ffmpeg-binaries, tylko normalne paczki dla systemu.

3. `npm install node-opus` lub `npm install opusscript`  
Zalecany node-opus.

__Instalacja:__  
* `npm i discord.js-muzykobot`  
Jakieś problemy? [Klik!](https://github.com/DarkoPendragon/discord.js-musicbot-addon/wiki/Installation-&-Troubleshooting)
Pamiętaj, że wersja z NPM jest odrobinkę opóźniona w stosunku do wersji z gita.

# Przykłady
***  
Sprawdź [tę stronę](https://github.com/MrBoombastic/discord.js-muzykobot/blob/master/examples/examples.md), aby zobaczyć przykłady użycia.

# Opcje i konfiguracja
***
__Większość opcji jest dodatkowych i nie są wymagane.__  
Opcje można podać w `music.start(client, {options})`. Lista opcji:

## Podstawowe opcje
| Nazwa | Typ | Opis | Domyślna wartość |  
| --- | --- | --- | --- |
| youtubeKey | String | Klucz YouTube Data API3. Wymagany do uruchomienia! | NaN |
| botPrefix | String | Ciąg znaków używany przed nazwą komendy. Można użyć również mapy z prefixami | ! |
| messageNewSong | Boolean | Czy bot ma wysyłać informacje o rozpoczęciu nowej piosenki | true |
| bigPicture | Boolean | Czy bot ma użyć dużych (true) czy małych (false) obrazów w wiadomości | false |
| maxQueueSize | Number | Maksymalna długość kolejki na serwerze. 0 oznacza nielimitowaną długość | 50 |
| defVolume | Number | Domyślna głośność. [0-200] | 50 |
| anyoneCanSkip | Boolean | Czy każdy może pominąć piosenkę | false |
| messageHelp | Boolean | Czy ma wysyłać listę komend na DM użytownika (true), czy na kanał (false) | false |
| botAdmins | Object/Array | Tablica ID adminów bota. Omijają uprawnienienia komend muzycznych | [ ] |
| anyoneCanAdjust | Boolean | Czy każdy może zmienić głośność. | false |
| ownerOverMember | Boolean | Czy właściciel bota omija uprawnienia `CanAdjust` i `CanSkip` | false |
| anyoneCanLeave | Boolean | Czy każdy może wyrzucić bota z kanału | false |
| ownerID | String | ID użytkownika discorda;. wymagane jeśli używasz `ownerOverMember`. | NaN |
| logging | Boolean | Dodatkowe logi (np. błędy które nie przerwały pracy bota) | true |
| requesterName | Boolean | Czy ma wyświetlać nazwę użytkownika który dodał piosenkę. | true |
| inlineEmbeds | Boolean | Czy pola wiadomości mają być w jednej linii. | false |
| musicPresence | Boolean | Czy bot ma zmieniać swój status (grę) na aktualnie graną piosenkę. | false |
| clearPresence | Boolean | Czy ma usuwać status (grę) zamiast ustawiać ją na "nic" | false |
| insertMusic | Boolean | Dodanie informacji muzycznego bota do `<Client>.music` przy uruchomieniu. | false |

## Przykład bota z wieloma prefixami
```js
<Client>.guilds.forEach
<Music>.start(<Client>, {
  youtubeKey: "Data Key",
  botPrefix: <MapObject>
});

// Exmaple Map Structure
{serverID: { prefix: "!" } }
```
Zobacz [przykłady](https://github.com/DarkoPendragon/discord.js-musicbot-addon/blob/master/examples/examples.md).
## Cooldown
| Nazwa | Typ | Opis | Domyślna wartość |    
| --- | --- | --- | --- |
| cooldown | Object | Główna nazwa obiektu | |
| cooldown.enabled | Boolean | Czy cooldown komend ma być włączony. | true |
| cooldown.timer | Number | Czas cooldownu w milisekundach. | 10000 |
| cooldown.exclude | Object/Array | Tablica wyjątków na które cooldown nie będzie działać. Trzeba podać **domyślne** nazwy komend, a nie ustawione! | ["volume","queue","pause","resume","np"] |  

## Opcje komend  
Przykład opcji komend. Takie opcje można ustawić dla komend: `play`, `remove`, `help`, `np`, `queue`, `volume`, `pause`, `resume`, `skip`, `clearqueue`, `loop`, `leave`.
```js
music.start(client, {
  <command>: {
    enabled: false,                    // True/False statement.
    alt: ["name1","name2","name3"],    // Array of alt names (aliases).
    help: "Help text.",                // String of help text.
    name: "play"                       // Name of the command.
    usage: "{{prefix}}play bad memes", // Usage text. {{prefix}} will insert the bots prefix.
    exclude: false                     // Excludes the command from the help command.
  }
});
```
