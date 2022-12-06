# rn-admob

AdMob integration for RN

## Installation

```sh
yarn add @imcsorin/rn-admob
```

```js
import {useInitialize} from '@imcsorin/rn-admob'
```

## Usage

Don't forget to add the following code in AndroidManifest.xml:

```xml
<manifest>
    <application>
        <!-- Sample AdMob app ID: ca-app-pub-3940256099942544~3347511713 -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"/>
    </application>
</manifest>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
