import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Button, Canvas, TextField, Form, FieldGroup } from 'datocms-react-ui';
import { Form as FormHandler, Field } from 'react-final-form';
import { ValidConfig, normalizeConfig } from '../types';
import ShopifyClient from '../utils/ShopifyClient';
import s from './styles.module.css';

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  return (
    <Canvas ctx={ctx}>
      <FormHandler<ValidConfig>
        initialValues={normalizeConfig(ctx.plugin.attributes.parameters)}
        validate={(values: ValidConfig) => {
          const errors: Record<string, string> = {};

          if (!values.shopifyDomain) {
            errors.shopifyDomain = 'This field is required!';
          }

          if (!values.storefrontAccessToken) {
            errors.storefrontAccessToken = 'This field is required!';
          }

          return errors;
        }}
        onSubmit={async (values: ValidConfig) => {
          try {
            const client = new ShopifyClient(values);
            await client.productsMatching('');
          } catch (e) {
            return {
              tupleFailing:
                'The API key seems to be invalid for the specified Shopify domain!',
            };
          }

          await ctx.updatePluginParameters(values);
          ctx.notice('Settings updated successfully!');
        }}
      >
        {({ handleSubmit, submitting, dirty, submitErrors }) => (
          <Form onSubmit={handleSubmit}>
            {submitErrors && submitErrors.tupleFailing && (
              <div className={s.error}>{submitErrors.tupleFailing}</div>
            )}
            <FieldGroup>
              <Field name="shopifyDomain">
                {({ input, meta: { error } }) => (
                  <TextField
                    id="shopifyDomain"
                    label="Shop ID"
                    hint={
                      <>
                        If your shop is <code>foo-bar.myshopify.com</code>, then
                        insert <code>foo-bar</code>
                      </>
                    }
                    placeholder="my-shop"
                    required
                    error={error}
                    {...input}
                  />
                )}
              </Field>
              <Field name="storefrontAccessToken">
                {({ input, meta: { error } }) => (
                  <TextField
                    id="storefrontAccessToken"
                    label="Storefront access token"
                    hint={
                      <>
                        You can get a Storefront access token by creating a
                        private app. Take a look at{' '}
                        <a
                          href="https://help.shopify.com/en/api/custom-storefronts/storefront-api/getting-started#authentication"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Shopify documentation
                        </a>{' '}
                        for more info
                      </>
                    }
                    textInputProps={{ monospaced: true }}
                    placeholder="XXXYYY"
                    required
                    error={error}
                    {...input}
                  />
                )}
              </Field>
              <Field name="autoApplyToFieldsWithApiKey">
                {({ input, meta: { error } }) => (
                  <TextField
                    id="autoApplyToFieldsWithApiKey"
                    label="Auto-apply this plugin to all Single-line fields fields matching the following API identifier:"
                    hint="A regular expression can be used"
                    placeholder="shopify_product_id"
                    error={error}
                    textInputProps={{ monospaced: true }}
                    {...input}
                  />
                )}
              </Field>
            </FieldGroup>
            <Button
              type="submit"
              fullWidth
              buttonSize="l"
              buttonType="primary"
              disabled={submitting || !dirty}
            >
              Save settings
            </Button>
          </Form>
        )}
      </FormHandler>
    </Canvas>
  );
}
